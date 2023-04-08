import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';

const providersAndExport = [UsersRepository];
@Module({
  providers: [...providersAndExport],
  exports: [...providersAndExport],
})
export class UsersModule {}
