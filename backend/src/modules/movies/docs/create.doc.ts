import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';

export function ApiCreateMedia() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'create a movie' }),
    ApiCreatedResponse({
      schema: {
        example: {
          statusCode: HttpStatus.CREATED,
          data: {
            id: '643c133ce18cd6e062ca1430',
            movieId: 424725,
            mediaSrc: 'uploads\\movies\\1681658638787-865869602-fakeName.mp4',
            hlsSrc: 'hls/fakeName',
            hlsPlaylistPath: 'hls\\fakeName\\fakeName_480_hls.m3u8',
            description: 'best movie',
            createdAt: '2023-04-16T15:24:44.658Z',
            updatedAt: '2023-04-16T15:24:44.658Z',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      schema: {
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ResponseMessages.MOVIE_IS_DUPLICATE,
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: ResponseMessages.INVALID_SRC,
          error: 'Not Found',
        },
      },
    }),
  );
}
