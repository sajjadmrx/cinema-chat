import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MoviesRepository {
  constructor(private db: PrismaService) {
  }
}