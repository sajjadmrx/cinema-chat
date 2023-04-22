import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiSignup() {
  return applyDecorators(
    ApiOperation({
      summary: 'signup',
      description: 'create User And get Jwt Token',
    }),
    ApiCreatedResponse({
      schema: {
        example: {
          statusCode: 201,
          data: 'xxxxxxx',
        },
      },
    }),
    ApiBadRequestResponse({
      schema: {
        example: {
          statusCode: 400,
          message: ResponseMessages.USER_EXISTS,
          error: 'Bad Request',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      schema: {
        example: {
          statusCode: 500,
          message: ResponseMessages.SERVER_ERROR,
          error: 'Internal Server Error ',
        },
      },
    }),
  );
}
