import { Module } from '@nestjs/common';
import { FileModule } from '../../file/file.module';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

const providersAndExports = [];

@Module({
  imports: [FileModule],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
