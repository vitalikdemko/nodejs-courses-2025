import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MessageDTO } from '../dto';
import { Store } from '../store/store';
import { v4 as uuidv4 } from 'uuid';

@Controller('/api/chats/:id/messages')
export class MessagesController {
  constructor(private store: Store) {}

  @Get()
  list(
    @Headers('X-User') user: string,
    @Param('id') chatId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '30',
  ): MessageDTO[] {
    const chat = this.store.chats.find((c) => c.id === chatId);
    if (!chat) throw new NotFoundException('Chat not found');
    if (!chat.members.includes(user)) throw new ForbiddenException('Not a member');

    let messages = this.store.messages.filter((m) => m.chatId === chatId);

    // Pagination by cursor (message ID)
    if (cursor) {
      const index = messages.findIndex((m) => m.id === cursor);
      if (index >= 0) {
        messages = messages.slice(0, index);
      }
    }

    return messages.slice(-Number(limit));
  }

  @Post()
  create(
    @Headers('X-User') author: string,
    @Param('id') chatId: string,
    @Body('text') text: string,
  ): MessageDTO {
    const chat = this.store.chats.find((c) => c.id === chatId);
    if (!chat) throw new NotFoundException('Chat not found');
    if (!chat.members.includes(author)) throw new ForbiddenException('Not a member');

    const message: MessageDTO = {
      id: uuidv4(),
      chatId,
      author,
      text,
      sentAt: new Date().toISOString(),
    };

    this.store.messages.push(message);
    this.store.save();

    return message;
  }
}
