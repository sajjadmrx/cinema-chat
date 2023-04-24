import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiLaveMember() {
  return applyDecorators(
    ApiOperation({ summary: 'lave Current user from the room' }),
    ApiBadRequestResponse({
      schema: {
        example: {
          statusCode: 400,
          message: ResponseMessages.USER_NOT_MEMBER,
          error: 'Bad Request',
        },
      },
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: HttpStatus.OK,
          data: ResponseMessages.SUCCESS,
        },
      },
    }),
  );
}
