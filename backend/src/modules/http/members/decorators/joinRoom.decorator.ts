import { applyDecorators, HttpStatus, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiJoinRoom() {
  return applyDecorators(
    ApiOperation({ summary: 'Add Current user to room' }),
    ApiBadRequestResponse({
      schema: {
        example: {
          statusCode: 400,
          message: ResponseMessages.MEMBER_EXISTS,
          error: 'Bad Request',
        },
      },
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: 200,
          data: {
            member: {
              roomId: 44117771,
              userId: 153875157545,
              inviteId: 0,
              permissions: ['DEFAULT'],
              nickname: null,
              createdAt: '2023-04-16T14:38:59.325Z',
              updatedAt: '2023-04-16T14:38:59.325Z',
            },
          },
        },
      },
    }),
    Put(),
  );
}
