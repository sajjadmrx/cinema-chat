import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileService } from '../../file/file.service';
import * as path from 'path';
import { createReadStream } from 'fs';

@Injectable()
export class StreamService {
  constructor(private fileService: FileService) {}

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
}
