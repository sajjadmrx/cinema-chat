import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FileService } from '../file/file.service';
import { MoviesRepository } from '../movies/movies.repository';
import * as path from 'path';
import { createReadStream } from 'fs';
import { ResponseMessages } from '../../shared/constants/response-messages.constant';

@Injectable()
export class StreamService {
  constructor(
    private fileService: FileService,
    private moviesRepository: MoviesRepository,
  ) {}

  async movie(src: string, res: Response, req: Request): Promise<void> {
    const filePath: string = path.join(path.resolve(), src);
    const stat = await this.fileService.getStat(filePath);
    const headers = {
      'Content-Length': stat.size,
      'Content-Type': 'application/vnd.apple.mpegurl',
    };

    res.writeHead(200, headers);
    const readStream = createReadStream(filePath);
    readStream.pipe(res);
  }

  async segment(
    segmentPath: string,
    res: Response,
    req: Request,
  ): Promise<void> {
    const hlsFolder: string | undefined = req.headers['content-folder'] as
      | string
      | undefined;
    if (!hlsFolder || typeof hlsFolder !== 'string')
      throw new BadRequestException(ResponseMessages.INVALID_SRC);

    const segmentFilePath: string = path.join(
      path.resolve(),
      hlsFolder,
      segmentPath,
    );
    const stat = await this.fileService.getStat(segmentFilePath);
    const headers = {
      'Content-Length': stat.size,
      'Content-Type': 'video/mp2t',
    };

    res.writeHead(200, headers);
    const readStream = createReadStream(segmentFilePath);
    readStream.pipe(res);
  }
}
