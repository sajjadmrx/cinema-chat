import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { Gateway } from './gateway';
import { AuthModule } from '../http/auth/auth.module';
import { UsersModule } from '../http/users/users.module';
import { RoomsModule } from '../http/rooms/rooms.module';
import { ChatEmit } from './emits/chat.emit';
import { MessagesModule } from '../http/messages/messages.module';
import { MembersModule } from '../http/members/members.module';
import { StreamEventService } from './services/stream.service';
import { ConnectionService } from './services/connection.service';
import { UserSocketManager } from './userSocket.manager';
import { StreamEmit } from './emits/stream.emit';

const providersAndExports = [
  ChatService,
  Gateway,
  ChatEmit,
  StreamEventService,
  ConnectionService,
  UserSocketManager,
];

@Module({
  imports: [
    AuthModule,
    forwardRef(() => RoomsModule),
    UsersModule,
    MessagesModule,
    forwardRef(() => MembersModule),
  ],
  providers: [...providersAndExports, StreamEmit],
  exports: [...providersAndExports],
})
export class SocketModule {}
