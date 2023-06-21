import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StreamService } from './stream.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stream')
@Controller('/stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get('/:hls/:folder/:file')
  async stream(
    @Param('hls') hls: string,
    @Param('folder') folder: string,
    @Param('file') file: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const src = `${hls}/${folder}/${file}`;
    await this.streamService.movie(src, res, req);
  }
}
