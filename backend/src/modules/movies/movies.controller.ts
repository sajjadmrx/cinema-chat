import {
  Body,
  Controller,
  Delete, Get,
  Param,
  ParseIntPipe,
  Post, Query,
  UseGuards, UseInterceptors
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MoviesService } from "./movies.service";
import { AuthGuard } from "@nestjs/passport";
import { CheckUserPermissions } from "../../shared/guards/user-permissions.guard";
import { MovieCreateDto } from "./dto/create.dto";
import { ResponseInterceptor } from "../../shared/interceptors/response.interceptor";
import { Movie } from "../../shared/interfaces/movie.interface";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";


@ApiTags("movies")
@UseInterceptors(ResponseInterceptor)
@Controller("movies")
export class MoviesController {
  constructor(private moviesService: MoviesService) {
  }

  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: [{
          "id": "63243ecd5eb62aeef61ee661",
          "movieId": 381535,
          "src": "uploads/movies/1663319734111-276982611-movie.mp4",
          "description": "best movie",
          "createdAt": "2022-09-16T09:15:57.887Z",
          "updatedAt": "2022-09-16T09:15:57.888Z"
        }]
      }
    }
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: "find all movies" })
  @UseGuards(AuthGuard("jwt"))
  @Get()
  findAll(@Query("page", ParseIntPipe) page: number, @Query("limit", ParseIntPipe) limit: number): Promise<Movie[]> {
    return this.moviesService.find(page, limit);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: "create a movie" })
  @UseGuards(CheckUserPermissions(["ADMINISTRATOR", "MANAGE_MOVIE"]))
  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Body() input: MovieCreateDto): Promise<Movie> {
    return this.moviesService.create(input);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "delete a movie" })
  @UseGuards(CheckUserPermissions(["ADMINISTRATOR", "MANAGE_MOVIE"]))
  @UseGuards(AuthGuard("jwt"))
  @Delete(":movieId")
  delete(@Param("movieId", ParseIntPipe) movieId: number): Promise<ResponseMessages> {
    return this.moviesService.deleteByMovieId(movieId);
  }
}