import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { AuthGuard } from '@nestjs/passport';
import { CheckUserPermissions } from '../../../shared/guards/user-permissions.guard';
import { MovieCreateDto } from './dto/create.dto';
import { ResponseInterceptor } from '../../../shared/interceptors/response.interceptor';
import { ApiFindAllMedia } from './docs/findAll.doc';
import { ApiCreateMedia } from './docs/create.doc';
import { ApiDeleteMedia } from './docs/delete.doc';
import { HttpExceptionFilter } from '../../../shared/filters/httpException.filter';

@ApiTags('movies')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @ApiFindAllMedia()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.moviesService.find(page, limit);
  }

  @ApiCreateMedia()
  @UseGuards(CheckUserPermissions(['ADMINISTRATOR', 'MANAGE_MOVIE']))
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() input: MovieCreateDto) {
    return this.moviesService.create(input);
  }

  @ApiDeleteMedia()
  @UseGuards(CheckUserPermissions(['ADMINISTRATOR', 'MANAGE_MOVIE']))
  @UseGuards(AuthGuard('jwt'))
  @Delete(':movieId')
  delete(@Param('movieId', ParseIntPipe) movieId: number) {
    return this.moviesService.deleteByMovieId(movieId);
  }
}
