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

  getBySrc(src: string): Promise<Movie | null> {
    return this.db.movie.findUnique({ where: { src } });
  }

}