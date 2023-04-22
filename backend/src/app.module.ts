import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/http/users/users.module';
import { AuthModule } from './modules/http/auth/auth.module';
import { RoomsModule } from './modules/http/rooms/rooms.module';
import { InvitesModule } from './modules/http/invites/invites.module';
import { MembersModule } from './modules/http/members/members.module';
import { SocketModule } from './modules/websocket/socket.module';
import { MessagesModule } from './modules/http/messages/messages.module';
import { MoviesModule } from './modules/http/movies/movies.module';
import { UploadsModule } from './modules/http/uploads/uploads.module';
import { StreamModule } from './modules/http/stream/stream.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RoomsModule,
    InvitesModule,
    MembersModule,
    SocketModule,
    MessagesModule,
    MoviesModule,
    UploadsModule,
    StreamModule,
    RedisModule,
  ],
})
export class AppModule {}
