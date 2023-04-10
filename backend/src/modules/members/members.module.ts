import { Module, forwardRef } from '@nestjs/common';
import { RoomsModule } from '../rooms/rooms.module';
import { MembersController } from './members.controller';
import { MembersDbRepository } from './repositories/members-db.repository';
import { MembersService } from './members.service';
import { SocketModule } from '../socket/socket.module';
import { InvitesModule } from '../invites/invites.module';
import { MembersRepository } from './repositories/members.repository';
import { MembersCacheRepository } from './repositories/members-cache.repository';

const providersAndExports = [MembersRepository];

@Module({
  imports: [
    forwardRef(() => SocketModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => InvitesModule),
  ],
  controllers: [MembersController],
  providers: [
    ...providersAndExports,
    MembersService,
    MembersDbRepository,
    MembersCacheRepository,
  ],
  exports: [...providersAndExports],
})
export class MembersModule {}
