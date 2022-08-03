import { Module } from '@nestjs/common';
import { RoomsModule } from '../rooms/rooms.module';
import { MembersController } from './members.controller';
import { MembersRepository } from './members.repository';
import { MembersService } from './members.service';

const providersAndExports = [MembersRepository];

@Module({
  imports: [RoomsModule],
  controllers: [MembersController],
  providers: [...providersAndExports, MembersService],
  exports: [...providersAndExports],
})
export class MembersModule {}
