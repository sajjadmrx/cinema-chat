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
                createdAt: '2022-08-16T09:28:43.546Z',
                updatedAt: '2022-08-16T09:28:43.546Z',
              },
              {
                id: '62fb75120ed4c1690f610649',
                roomId: 91562274,
                ownerId: 153875157545,
                name: 'xxxx',
                isPublic: true,
                avatar: 'DEFAULT_AVATAR',
                createdAt: '2022-08-16T10:44:34.424Z',
                updatedAt: '2022-08-16T10:44:34.424Z',
              },
              {
                id: '62ff4f3ba01f4c8f03eec7da',
                roomId: 32199774,
                ownerId: 925674628193,
                name: 'xxxx',
                isPublic: true,
                avatar: 'DEFAULT_AVATAR',
                createdAt: '2022-08-19T08:52:11.069Z',
                updatedAt: '2022-08-19T08:52:11.071Z',
              },
              {
                id: '6309b99bf06fc80bca9e1b23',
                roomId: 26297437,
                ownerId: 692869485481,
                name: 'xxxx',
                isPublic: true,
                avatar: 'DEFAULT_AVATAR',
                createdAt: '2022-08-27T06:28:43.142Z',
                updatedAt: '2022-08-27T06:28:43.142Z',
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
