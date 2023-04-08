import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { ChatEmits } from './chat.emits';
import { MessagesModule } from '../messages/messages.module';
import { MembersModule } from '../members/members.module';
import { StreamEventService } from './services/stream.service';
import { ConnectionService } from './services/connection.service';

const providersAndExports = [
  ChatService,
  ChatGateway,
  ChatEmits,
  StreamEventService,
  ConnectionService,
];

@Module({
  imports: [
    AuthModule,
    forwardRef(() => RoomsModule),
    UsersModule,
    MessagesModule,
    forwardRef(() => MembersModule),
  ],
  providers: [...providersAndExports],
  exports: [...providersAndExports],
})
export class ChatModule {}
