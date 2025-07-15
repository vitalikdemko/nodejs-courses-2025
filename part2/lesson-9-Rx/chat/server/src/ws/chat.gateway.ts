import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import Redis from "ioredis";
import { v4 as uuid } from "uuid";
import { ForbiddenException, OnModuleDestroy } from "@nestjs/common";
import { Store } from "../store/store";
import { ChatDTO, MessageDTO } from "../dto";

const INSTANCE_ID = uuid();

@WebSocketGateway({ path: "/ws", cors: true })
export class ChatGateway implements OnGatewayConnection, OnModuleDestroy {
  @WebSocketServer() server!: Server;

  private readonly sub: Redis;
  private event$ = new Subject<{ ev: string; data: any; meta?: any }>();

  constructor(private store: Store, private readonly redis: Redis) {
    this.sub = this.redis.duplicate();

    this.sub.subscribe("chat-events");
    this.sub.on("message", (_, raw) => {
      const parsed = JSON.parse(raw);
      if (parsed.src === INSTANCE_ID) return;
      console.log("Received event:", parsed);
      this.event$.next(parsed);
    });

    this.event$
      .pipe(filter((e) => e.meta?.local))
      .subscribe((e) =>
        this.redis.publish(
          "chat-events",
          JSON.stringify({ ...e, meta: undefined, src: INSTANCE_ID })
        )
      );
  }

  broadcastChatCreated(chat: ChatDTO) {
    this.event$.next({
      ev: "chatCreated",
      data: chat,
      meta: { local: true },
    });
  }

  broadcastMembersUpdated(chatId: string, members: string[]) {
    this.event$.next({
      ev: "membersUpdated",
      data: { chatId, members },
      meta: { local: true },
    });
  }

  onModuleDestroy() {
    this.sub.disconnect();
    this.redis.disconnect();
  }

  handleConnection(client: Socket) {
    const user = client.handshake.auth?.user as string;
    if (!user) return client.disconnect(true);
    client.data.user = user;

    this.event$
      .pipe(
        filter((e) => {
          if (e.ev === "message") return true;
          if (e.ev === "typing") return e.data.user !== user;
          if (e.ev === "chatCreated") return e.data.members.includes(user);
          return false;
        })
      )
      .subscribe((e) => {
        if (e.ev === "chatCreated") {
          client.emit("chatCreated", e.data);
        } else {
          this.server.to(e.data.chatId).emit(e.ev, e.data);
        }
      });
  }

  @SubscribeMessage("join")
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    const user = client.data.user as string;
    const chat = this.store.chats.find((c) => c.id === body.chatId);

    if (!chat || !chat.members.includes(user)) {
      throw new ForbiddenException();
    }

    client.join(body.chatId);
  }

  @SubscribeMessage("leave")
  onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string }
  ) {
    client.leave(body.chatId);
  }

  @SubscribeMessage("send")
  onSend(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; text: string }
  ) {
    const user = client.data.user as string;
    const chat = this.store.chats.find((c) => c.id === body.chatId);
    if (!chat || !chat.members.includes(user)) {
      throw new ForbiddenException();
    }

    const message: MessageDTO = {
      id: uuid(),
      chatId: body.chatId,
      author: user,
      text: body.text,
      sentAt: new Date().toISOString(),
    };

    this.store.messages.push(message);
    this.store.save();

    this.event$.next({
      ev: "message",
      data: message,
      meta: { local: true },
    });

    //this.server.to(body.chatId).emit('message', message);
  }

  @SubscribeMessage("typing")
  onTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { chatId: string; isTyping: boolean }
  ) {
    const user = client.data.user as string;
    const chat = this.store.chats.find((c) => c.id === body.chatId);

    if (!chat || !chat.members.includes(user)) {
      throw new ForbiddenException();
    }

    this.event$.next({
      ev: "typing",
      data: {
        chatId: body.chatId,
        user,
        isTyping: body.isTyping,
      },
      meta: { local: true },
    });
  }
}
