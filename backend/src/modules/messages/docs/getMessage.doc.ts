import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';

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
  );
}
