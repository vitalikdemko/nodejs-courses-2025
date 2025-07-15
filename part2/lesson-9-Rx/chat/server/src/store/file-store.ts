import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ChatDTO, MessageDTO } from 'src/dto';

@Injectable()
export class FileStore {
  private chatsPath = path.resolve('storage/chats.json');
  private messagesPath = path.resolve('storage/messages.json');

  saveFile(file: any) {
    console.log('Pretending to save file:', file);
  }

  async saveChat(chat: ChatDTO): Promise<void> {
    const chats = await this.getAllChats();
    chats.push(chat);
    await fs.mkdir(path.dirname(this.chatsPath), { recursive: true });
    await fs.writeFile(this.chatsPath, JSON.stringify(chats, null, 2));
  }

  async getAllChats(): Promise<ChatDTO[]> {
    try {
      const data = await fs.readFile(this.chatsPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveMessage(msg: MessageDTO): Promise<void> {
    const messages = await this.getAllMessages();
    messages.push(msg);
    await fs.mkdir(path.dirname(this.messagesPath), { recursive: true });
    await fs.writeFile(this.messagesPath, JSON.stringify(messages, null, 2));
  }

  async getAllMessages(): Promise<MessageDTO[]> {
    try {
      const data = await fs.readFile(this.messagesPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getMessagesByChatId(chatId: string): Promise<MessageDTO[]> {
    const all = await this.getAllMessages();
    return all.filter((m) => m.chatId === chatId);
  }
}
