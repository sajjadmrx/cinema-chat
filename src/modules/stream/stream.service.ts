import { Injectable, NotFoundException } from "@nestjs/common";
import { Response } from "express";
import { Movie } from "../../shared/interfaces/movie.interface";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";
import { ReadStream, Stats } from "fs";
import { FileService } from "../file/file.service";
import { MoviesRepository } from "../movies/movies.repository";

@Injectable()
export class StreamService {
  constructor(private fileService: FileService, private moviesRepository: MoviesRepository) {
  }

  async movie(movieId: number, range: string, res: Response): Promise<void> {
    try {
      const movie: Movie | null = await this.moviesRepository.getByMovieId(movieId);
      if (!movie)
        throw new NotFoundException(ResponseMessages.MOVIE_NOT_FOUND);

      const srcIsValid: boolean = await this.fileService.checkFileExists(movie.src);
      if (!srcIsValid)
        throw new NotFoundException(ResponseMessages.SRC_INVALID);
      const fileStat: Stats = await this.fileService.getStat(movie.src);//fs.statSync(musicPath).size;
      const fileSize: number = fileStat.size;
      const chunkSize = 1 * 1e+6;
      const start: number = Number(range.replace(/\D/g, ""));
      const end: number = Math.min(start + chunkSize, fileSize - 1);
      const contentLength: number = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/webm"
      };
      const stream: ReadStream = await this.fileService.streamFile(movie.src, start, end);
      res.writeHead(206, headers);
      stream.pipe(res);
    } catch (e) {
      throw e;
    }
  }
}