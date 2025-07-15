import { v4 as uuidv4 } from 'uuid';
import { Body, Controller, Get, Headers, NotFoundException, Post } from '@nestjs/common';
import { ChatDTO } from 'src/dto';
import { FileStore } from 'src/store/file-store';
import { ChatGateway } from 'src/ws/chat.gateway';
import { Patch, Param } from '@nestjs/common';

@Controller('/api/chats')
export class ChatsController {
  constructor(private readonly store: FileStore, private readonly gateway: ChatGateway ) {}

 @Post()
  async create(
    @Headers('X-User') creator: string,
    @Body() body: { name?: string; members: string[] }
  ): Promise<ChatDTO> {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    const name =
      body.name ?? body.members.length === 1
        ? `${creator} & ${body.members[0]}`
        : undefined;

    const uniqueMembers = Array.from(new Set([creator, ...body.members]));

    const chat: ChatDTO = {
      id,
      name: name ?? '',
      members: uniqueMembers,
      updatedAt: createdAt,
    };

    await this.store.saveChat(chat);

    this.gateway.broadcastChatCreated(chat); 

    return chat;
  }

  @Patch(':id/members')
  async updateMembers(
    @Headers('x-user') user: string,
    @Param('id') chatId: string,
    @Body() body: { add?: string[]; remove?: string[] }
  ): Promise<void> {
    const chat = (await this.store.getAllChats()).find((c) => c.id === chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    const next = new Set(chat.members);

    body.add?.forEach((m) => next.add(m));
    body.remove?.forEach((m) => next.delete(m));

    chat.members = Array.from(next);
    chat.updatedAt = new Date().toISOString();

    await this.store.saveChat(chat);
    this.gateway.broadcastMembersUpdated(chat.id, chat.members); 
  }

  @Get()
  async list(@Headers('x-user') user: string): Promise<ChatDTO[]> {
    const allChats = await this.store.getAllChats();
    return allChats.filter(chat => chat.members.includes(user));
  }
}
