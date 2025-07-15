import {Module} from '@nestjs/common';
import {ChatsController} from './chats.controller';
import {UsersModule} from "../users/users.module";
import { FileStore } from 'src/store/file-store';
import { ChatGateway } from 'src/ws/chat.gateway';

@Module({
  imports: [UsersModule],
  controllers: [ChatsController],
  providers: [FileStore, ChatGateway],
  exports: [ChatGateway],  
})
export class ChatsModule { }