import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

export function ApiGetRooms() {
  return applyDecorators(
    ApiOperation({
      summary: 'get public rooms',
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: 200,
          data: {
            totalRooms: 4,
            totalPages: 1,
            nextPage: null,
            rooms: [
              {
                id: '62fb634b450c3733a4e2080a',
                roomId: 44117771,
                ownerId: 925674628193,
                name: 'xxx',
                isPublic: true,
                avatar: 'DEFAULT_AVATAR',
                _count: {
                  members: 1,
                },
                createdAt: '2022-08-16T09:28:43.546Z',
                updatedAt: '2022-08-16T09:28:43.546Z',
              },
            ],
          },
        },
      },
    }),
    ApiQuery({
      name: 'limit',
      type: Number,
      required: false,
      example: 10,
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      required: false,
      example: 1,
    }),
  );
}
