import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { MembersModule } from './members/members.module';
import { MessagesModule } from './messages/messages.module';
import { InvitesModule } from './invites/invites.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RoomsModule,
    MembersModule,
    MessagesModule,
    InvitesModule,
  ],
  providers: [],
  exports: [],
})
export class HttpModule {}
