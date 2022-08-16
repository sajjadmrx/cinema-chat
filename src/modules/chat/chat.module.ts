import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [AuthModule, forwardRef(() => RoomsModule), UsersModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatGateway],
})
export class ChatModule {}
