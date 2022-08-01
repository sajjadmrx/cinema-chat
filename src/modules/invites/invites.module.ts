import { Module } from '@nestjs/common';
import { InvitesRepository } from './invites.repository';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';
import { RoomsModule } from '../rooms/rooms.module';


const providersAndExports = [InvitesRepository]
@Module({
  imports: [RoomsModule],
  controllers: [InvitesController],
  providers: [InvitesService, ...providersAndExports],
  exports: [...providersAndExports]
})
export class InvitesModule { }
