import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Movie, MovieCreateInput } from "../../shared/interfaces/movie.interface";

@Injectable()
export class MoviesRepository {
  constructor(private db: PrismaService) {
  }

  create(input: MovieCreateInput): Promise<Movie> {
    return this.db.movie.create({ data: input });
  }
}