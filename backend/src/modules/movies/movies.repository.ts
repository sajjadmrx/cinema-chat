import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Movie, MovieCreateInput } from "../../shared/interfaces/movie.interface";
import { getRandomNumber } from "../../shared/utils/uuid.util";

@Injectable()
export class MoviesRepository {
  constructor(private db: PrismaService) {
  }

  create(input: Omit<MovieCreateInput, "movieId">): Promise<Movie> {
    return this.db.movie.create({ data: { ...input, movieId: getRandomNumber(6) } });
  }

  getByMediaSrc(getByMediaSrcSrc: string): Promise<Movie | null> {
    return this.db.movie.findUnique({ where: { mediaSrc: getByMediaSrcSrc } });
  }

  getByMovieId(movieId: number): Promise<Movie | null> {
    return this.db.movie.findUnique({
      where: {
        movieId
      }
    });
  }

  deleteByMovieId(movieId: number): Promise<Movie> {
    return this.db.movie.delete({
      where: {
        movieId
      }
    });
  }

  find(page: number, limit: number): Promise<Movie[]> {
    return this.db.movie.findMany({
      take: limit,
      skip: (page - 1) * limit
    });
  }

}
