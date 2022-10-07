import { Module } from "@nestjs/common";
import { FileModule } from "../file/file.module";
import { MoviesModule } from "../movies/movies.module";
import { StreamController } from "./stream.controller";
import { StreamService } from "./stream.service";


const providersAndExports = [];

@Module({
  imports: [FileModule, MoviesModule],
  controllers: [StreamController],
  providers: [StreamService]
})
export class StreamModule {
}
