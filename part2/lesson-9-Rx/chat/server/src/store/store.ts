import { Injectable, OnModuleInit } from '@nestjs/common';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ChatDTO, MessageDTO, UserDTO } from '../dto';

@Injectable()
export class Store implements OnModuleInit {
  users: UserDTO[] = [];
  chats: ChatDTO[] = [];
  messages: MessageDTO[] = [];

  private filePath = join(process.cwd(), 'fs-db', 'db.json');

  onModuleInit() {
    if (!existsSync(this.filePath)) {
      if (!existsSync(join(process.cwd(), 'fs-db'))) {
        mkdirSync(join(process.cwd(), 'fs-db'));
      }
      writeFileSync(
        this.filePath,
        JSON.stringify({ users: [], chats: [], messages: [] }, null, 2),
      );
    }

    const raw = readFileSync(this.filePath, 'utf-8');
    const parsed = JSON.parse(raw);

    this.users = parsed.users ?? [];
    this.chats = parsed.chats ?? [];
    this.messages = parsed.messages ?? [];
  }

  save() {
    const data = {
      users: this.users,
      chats: this.chats,
      messages: this.messages,
    };
    writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}
