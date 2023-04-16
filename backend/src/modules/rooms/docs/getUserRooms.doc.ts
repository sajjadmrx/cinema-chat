import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';

export function ApiGetUserRooms() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'get current User Rooms',
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: 200,
          data: {
            totalRooms: 1,
            totalPages: 1,
            nextPage: null,
            rooms: [
              {
                id: '6309b99bf06fc80bca9e1b23',
                roomId: 26297437,
                ownerId: 692869485481,
                name: 'xxxx',
                isPublic: false,
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
      type: String,
      required: false,
      example: 10,
    }),
    ApiQuery({
      name: 'page',
      type: String,
      required: false,
      example: 1,
    }),
  );
}
