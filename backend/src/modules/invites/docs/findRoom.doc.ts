import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiFindRoomInvite() {
  return applyDecorators(
    ApiOperation({
      summary: 'find room by slug',
    }),
    ApiResponse({
      status: 200,
      description: 'Find room By Slug',
      schema: {
        example: {
          statusCode: 200,
          data: {
            roomId: 26297437,
            ownerId: 692869485481,
            inviteId: 165489521651,
            name: 'relaxing',
            isPublic: false,
            avatar: 'DEFAULT_AVATAR',
            createdAt: '2022-08-27T06:28:43.142Z',
            updatedAt: '2022-08-27T06:28:43.142Z',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      schema: {
        example: {
          statusCode: 404,
          message: 'INVALID_INVITE',
        },
      },
    }),
    ApiBadRequestResponse({
      status: 400,
      description: 'When the Expire time expired',
      schema: {
        example: {
          statusCode: 400,
          message: 'EXPIRED_TIME',
        },
      },
    }),
    ApiParam({ name: 'slug', type: String }),
  );
}
