import { forwardRef, Module } from '@nestjs/common';
import { InvitesRepository } from './invites.repository';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { RoomsModule } from '../rooms/rooms.module';
import { MembersModule } from '../members/members.module';

const providersAndExports = [InvitesRepository];

@Module({
  imports: [forwardRef(() => RoomsModule), forwardRef(() => MembersModule)],
  controllers: [InvitesController],
  providers: [InvitesService, ...providersAndExports],
  exports: [...providersAndExports],
})
export class InvitesModule {}
