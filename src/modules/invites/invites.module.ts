import { Module } from '@nestjs/common';
import { InvitesRepository } from './invites.repository';
import { InvtesService } from './invites.service';


const providersAndExports = [InvitesRepository]
@Module({
  providers: [InvtesService, ...providersAndExports],
  exports: [...providersAndExports]
})
export class InvitesModule { }
