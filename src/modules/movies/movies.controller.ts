import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";
import { AuthGuard } from "@nestjs/passport";
import { CheckUserPermissions } from "../../shared/guards/user-permissions.guard";
import { MovieCreateDto } from "./dto/create.dto";


@ApiTags("movies")
@Controller("movies")
export class MoviesController {
  constructor(private moviesService: MoviesService) {
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: "create a movie" })
  @UseGuards(CheckUserPermissions(["ADMINISTRATOR", "MANAGE_MOVIE"]))
  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Body() input: MovieCreateDto) {
    return this.moviesService.create(input);
  }
}