import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiFile } from '../../../../shared/decorators/api-File.decorator';

export function ApiUploadMedia() {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        example: {
          statusCode: HttpStatus.CREATED,
          data: {
            mediaSrc: 'uploads/movies/xxx.mp4',
            hlsSrc: 'hls/xx',
            hlsPlaylistPath: 'hls/xx/xxx_480_hls.m3u8',
          },
        },
      },
    }),
    ApiOperation({
      summary: 'upload a movie',
    }),
    ApiConsumes('multipart/form-data'),
    ApiFile('movie'),
  );
}
