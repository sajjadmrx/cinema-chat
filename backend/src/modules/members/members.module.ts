import { Module, forwardRef } from '@nestjs/common';
import { RoomsModule } from '../rooms/rooms.module';
import { MembersController } from './members.controller';
import { MembersDbRepository } from './repositories/members-db.repository';
import { MembersService } from './members.service';
import { ChatModule } from '../chat/chat.module';
import { InvitesModule } from '../invites/invites.module';
import { MembersRepository } from './repositories/members.repository';
import { MembersCacheRepository } from './repositories/members-cache.repository';

const providersAndExports = [
  MembersRepository,
  MembersDbRepository,
  MembersCacheRepository,
];

@Module({
  imports: [
    forwardRef(() => ChatModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => InvitesModule),
  ],
  controllers: [MembersController],
  providers: [...providersAndExports, MembersService],
  exports: [...providersAndExports],
})
export class MembersModule {}
