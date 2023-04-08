import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { FileModule } from '../file/file.module';

const providersAndExports = [MoviesRepository];

@Module({
  imports: [FileModule],
  controllers: [MoviesController],
  providers: [MoviesService, ...providersAndExports],
  exports: [...providersAndExports],
})
export class MoviesModule {}
