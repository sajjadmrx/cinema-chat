import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MoviesRepository } from './movies.repository';
import { MovieCreateDto } from './dto/create.dto';
import { Movie } from '../../../shared/interfaces/movie.interface';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';
import { FileService } from '../../file/file.service';
import { ResponseFormat } from '../../../shared/interfaces/response.interface';

@Injectable()
export class MoviesService {
  constructor(
    private moviesRepository: MoviesRepository,
    private fileService: FileService,
  ) {}

  async create(data: MovieCreateDto): Promise<ResponseFormat<Movie>> {
    try {
      let movie: Movie = await this.moviesRepository.getByMediaSrc(
        data.mediaSrc,
      );
      if (movie)
        throw new BadRequestException(ResponseMessages.MOVIE_IS_DUPLICATE);

      const hasExistSrc: boolean = await this.fileService.checkFileExists(
        data.mediaSrc,
      );
      if (!hasExistSrc)
        throw new NotFoundException(ResponseMessages.INVALID_SRC);

      movie = await this.moviesRepository.create({
        mediaSrc: data.mediaSrc,
        hlsSrc: data.hlsSrc,
        hlsPlaylistPath: data.hlsPlaylistPath,
        description: data.description,
      });
      return {
        statusCode: HttpStatus.CREATED,
        data: movie,
      };
    } catch (e) {
      throw e;
    }
  }

  async deleteByMovieId(
    movieId: number,
  ): Promise<ResponseFormat<ResponseMessages>> {
    try {
      let movie: Movie | null = await this.moviesRepository.getByMovieId(
        movieId,
      );
      if (!movie) throw new NotFoundException('MOVIE_NOT_FOUND');

      const hasExistsSrc: boolean = await this.fileService.checkFileExists(
        movie.mediaSrc,
      );
      if (hasExistsSrc) {
        await this.fileService.removeByPath(movie.mediaSrc);
        await this.fileService.removeByPath(movie.hlsSrc);
      }
      await this.moviesRepository.deleteByMovieId(movieId);
      return {
        statusCode: HttpStatus.OK,
        data: ResponseMessages.SUCCESS,
      };
    } catch (e) {
      throw e;
    }
  }

  async find(page: number, limit: number): Promise<ResponseFormat<Movie[]>> {
    if (page < 0) page = 1;
    if (limit > 10 || limit < 0) limit = 10;
    const media = await this.moviesRepository.find(page, limit);
    return {
      statusCode: HttpStatus.OK,
      data: media,
    };
  }
}
