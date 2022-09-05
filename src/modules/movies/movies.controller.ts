import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";


@ApiTags("movies")
@Controller("movies")
export class MoviesController {
  constructor(private moviesService: MoviesService) {
  }


  @Get()
  getAll() {
    return [];
  }
}