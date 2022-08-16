import { Module, forwardRef } from '@nestjs/common';
import { RoomsModule } from '../rooms/rooms.module';
import { MembersController } from './members.controller';
import { MembersRepository } from './members.repository';
import { MembersService } from './members.service';
import { ChatModule } from '../chat/chat.module';
import { InvitesModule } from '../invites/invites.module';

const providersAndExports = [MembersRepository];

@Module({
  imports: [
    ChatModule,
    forwardRef(() => RoomsModule),
    forwardRef(() => InvitesModule),
  ],
  controllers: [MembersController],
  providers: [...providersAndExports, MembersService],
  exports: [...providersAndExports],
})
export class MembersModule {}
