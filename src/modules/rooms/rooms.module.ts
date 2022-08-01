import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsRepository } from './rooms.repository';
import { RoomsService } from './rooms.service';

const providersAndExport = [RoomsRepository]
@Module({
  controllers: [RoomsController],
  providers: [...providersAndExport, RoomsService],
  exports: [...providersAndExport]
})
export class RoomsModule { }
