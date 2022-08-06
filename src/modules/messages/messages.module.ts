import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
