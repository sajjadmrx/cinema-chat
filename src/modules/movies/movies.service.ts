import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { MoviesRepository } from "./movies.repository";
import { MovieCreateDto } from "./dto/create.dto";
import { Movie } from "../../shared/interfaces/movie.interface";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";
import { FileService } from "../file/file.service";

@Injectable()
export class MoviesService {
  constructor(
    private moviesRepository: MoviesRepository,
    private fileService: FileService
  ) {
  }

  async create(data: MovieCreateDto) {
    try {
      let movie: Movie = await this.moviesRepository.getBySrc(data.src);
      if (movie)
        throw new BadRequestException(ResponseMessages.MOVIE_IS_DUPLICATE);

      const hasExistSrc: boolean = await this.fileService.checkFileExists(data.src);
      if (!hasExistSrc)
        throw  new BadRequestException("SRC_INVALID");

      movie = await this.moviesRepository.create({
        src: data.src,
        description: data.description
      });
      return movie;
    } catch (e) {
      throw e;
    }
  }

  async deleteByMovieId(movieId: number) {
    try {
      let movie: Movie | null = await this.moviesRepository.getByMovieId(movieId);
      if (!movie)
        throw new NotFoundException("MOVIE_NOT_FOUND");

      const hasExistsSrc: boolean = await this.fileService.checkFileExists(movie.src);
      if (hasExistsSrc) {
        await this.fileService.removeByPath(movie.src);
      }
      await this.moviesRepository.deleteByMovieId(movieId);
      return ResponseMessages.SUCCESS;
    } catch (e) {
      throw e;
    }
  }

  async find(page: number, limit: number): Promise<Movie[]> {
    if (page < 0)
      page = 1;
    if (limit > 10 || limit < 0)
      limit = 10;
    return this.moviesRepository.find(page, limit);
  }

}