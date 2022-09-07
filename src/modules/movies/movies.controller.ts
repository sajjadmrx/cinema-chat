import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";
import { AuthGuard } from "@nestjs/passport";
import { CheckUserPermissions } from "../../shared/guards/user-permissions.guard";


@ApiTags("movies")
@UseGuards(AuthGuard("jwt"))
@Controller("movies")
export class MoviesController {
  constructor(private moviesService: MoviesService) {
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: "create a movie" })
  @UseGuards(CheckUserPermissions(["ADMINISTRATOR", "MANAGE_MOVIE"]))
  @Post()
  create() {
    return "OK";
  }
}