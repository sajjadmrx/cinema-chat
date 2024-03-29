import { forwardRef, Module } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { RoomsModule } from '../rooms/rooms.module';
import { RoomMessagesController } from './room-messages.controller';
import { MembersModule } from '../members/members.module';
import { SocketModule } from '../socket/socket.module';

const providersAndExports = [MessagesRepository, MessagesService];

@Module({
  imports: [
    forwardRef(() => RoomsModule),
    forwardRef(() => MembersModule),
    forwardRef(() => SocketModule),
  ],
  providers: [...providersAndExports],
  controllers: [RoomMessagesController],
  exports: [...providersAndExports],
})
export class MessagesModule {}
