import { Module } from "@nestjs/common";
import { MoviesService } from "./movies.service";
import { MoviesController } from "./movies.controller";
import { MoviesRepository } from "./movies.repository";

const providersAndExports = [MoviesRepository];

@Module({
  imports: [],
  controllers: [MoviesController],
  providers: [MoviesService, ...providersAndExports],
  exports: [...providersAndExports]
})
export class MoviesModule {
}