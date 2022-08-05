import { Module, forwardRef } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { RoomsService } from './rooms.service';
import { MembersModule } from '../members/members.module';

const providersAndExport = [RoomsRepository];

@Module({
  imports: [forwardRef(() => MembersModule)],
  controllers: [RoomsController],
  providers: [...providersAndExport, RoomsService],
  exports: [...providersAndExport],
})
export class RoomsModule {}
