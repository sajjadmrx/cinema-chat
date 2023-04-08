import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

const providersAndExport = [PrismaService];

@Global()
@Module({
  providers: [...providersAndExport],
  exports: [...providersAndExport],
})
export class PrismaModule {}
