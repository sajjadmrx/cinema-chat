import { applyDecorators, Get, HttpStatus } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiGetMessage() {
  return applyDecorators(
    ApiOperation({
      summary: 'fetch message by MessageID',
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: HttpStatus.OK,
          data: {
            id: '644d74959a24d4f89413f711',
            messageId: 38953544752,
            authorId: 953983315865,
            roomId: 16144573,
            content: 'Hello',
            replyId: null,
            type: 'TEXT',
            createdAt: '2023-04-29T19:48:37.116Z',
            updatedAt: '2023-04-29T19:48:37.116Z',
            author: {
              nickname: null,
              user: {
                username: 'sajjadmrx',
              },
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: ResponseMessages.MESSAGE_NOT_FOUND,
          error: 'Not Found',
        },
      },
    }),
    Get(':messageId'),
  );
}
