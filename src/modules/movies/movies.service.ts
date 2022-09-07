import { BadRequestException, Injectable } from "@nestjs/common";
import { MoviesRepository } from "./movies.repository";
import { MovieCreateDto } from "./dto/create.dto";
import { Movie } from "../../shared/interfaces/movie.interface";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";

@Injectable()
export class MoviesService {
  constructor(private moviesRepository: MoviesRepository) {
  }

  async create(data: MovieCreateDto) {
    try {
      let movie: Movie = await this.moviesRepository.getBySrc(data.src);
      if (movie)
        throw new BadRequestException(ResponseMessages.MOVIE_IS_DUPLICATE);

    } catch (e) {
      throw e;
    }
  }
}