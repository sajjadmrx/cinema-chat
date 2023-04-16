import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';

export function ApiGetRoomMessages() {
  return applyDecorators(
    ApiOperation({
      summary: 'fetch room messages by roomId',
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
    ApiOkResponse({
      schema: {
        example: {
          statusCode: HttpStatus.OK,
          data: [
            {
              id: '6309cedd240c517af3430124',
              messageId: 99411667148,
              authorId: 925674628193,
              roomId: 44117771,
              content: 'Hello',
              replyId: null,
              type: 'TEXT',
              createdAt: '2022-08-27T07:59:25.391Z',
              updatedAt: '2022-08-27T07:59:25.391Z',
            },
            {
              id: '62ff73bc7dcefb647e147c95',
              messageId: 43122166976,
              authorId: 925674628193,
              roomId: 44117771,
              content: 'hello and welcome ',
              replyId: 62757247333,
              type: 'TEXT',
              createdAt: '2022-08-19T11:27:56.289Z',
              updatedAt: '2022-08-19T11:27:56.289Z',
            },
            {
              id: '62ff71d59c972dad2e898583',
              messageId: 62757247333,
              authorId: 925674628193,
              roomId: 44117771,
              content: 'Hello World',
              replyId: null,
              type: 'TEXT',
              createdAt: '2022-08-19T11:19:49.231Z',
              updatedAt: '2022-08-19T11:19:49.231Z',
            },
          ],
        },
      },
    }),
    ApiNotFoundResponse({
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: ResponseMessages.ROOM_NOT_FOUND,
          error: 'Not Found',
        },
      },
    }),
  );
}
