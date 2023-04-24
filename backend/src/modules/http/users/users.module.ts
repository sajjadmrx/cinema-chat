import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CurrentUserController } from './controllers/current-user.controller';
import { UsersService } from './users.service';

const providersAndExport = [UsersRepository];
@Module({
  providers: [...providersAndExport, UsersService],
  exports: [...providersAndExport],
  controllers: [CurrentUserController],
})
export class UsersModule {}
