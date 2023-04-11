import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { Gateway } from './gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { ChatEmit } from './emits/chat.emit';
import { MessagesModule } from '../messages/messages.module';
import { MembersModule } from '../members/members.module';
import { StreamEventService } from './services/stream.service';
import { ConnectionService } from './services/connection.service';
import { UserSocketManager } from './userSocket.manager';
import { MoviesModule } from '../movies/movies.module';
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
    MoviesModule,
    forwardRef(() => MembersModule),
  ],
  providers: [...providersAndExports, StreamEmit],
  exports: [...providersAndExports],
})
export class SocketModule {}
