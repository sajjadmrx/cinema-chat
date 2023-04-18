import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiFindAllMedia() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      schema: {
        example: {
          statusCode: 200,
          data: [
            {
              id: '64302b3fce505e1c38b3bec1',
              movieId: 534789,
              mediaSrc:
                'uploads\\movies\\1680878198330-546880869-df005wSpiderMan-.mp4',
              hlsSrc: 'hls/df005wSpiderMan-',
              hlsPlaylistPath:
                'hls\\df005wSpiderMan-\\df005wSpiderMan-_480_hls.m3u8',
              description: 'xxxxxx',
              createdAt: '2023-04-07T14:39:59.084Z',
              updatedAt: '2023-04-07T14:39:59.086Z',
            },
            {
              id: '64306416450ba41ad521ae2c',
              movieId: 617141,
              mediaSrc: 'uploads\\movies\\1680892890569-127671098-xxxx.mp4',
              hlsSrc: 'hls/xxxx',
              hlsPlaylistPath: 'hls\\xxxx\\xx_480_hls.m3u8',
              description: 'xxxxx',
              createdAt: '2023-04-07T18:42:30.894Z',
              updatedAt: '2023-04-07T18:42:30.894Z',
            },
          ],
        },
      },
    }),
    ApiBearerAuth(),
    ApiOperation({ summary: 'find all movies' }),
  );
}
