import { Controller, Get, Param, ParseIntPipe, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { StreamService } from "./stream.service";

@ApiTags("stream")
//todo stream with http stream Live (HLS)
@Controller()
export class StreamController {
  constructor(private streamService: StreamService) {
  }

  @ApiOperation({ summary: "stream movie" })
  @Get("stream/:movieId")
  stream(@Param("movieId", ParseIntPipe) movieId: number, @Req() req: Request, @Res() res: Response) {
    return this.streamService.movie(movieId, req.headers.range || "", res);
  }
}