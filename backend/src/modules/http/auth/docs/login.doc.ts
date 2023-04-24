import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'login',
      description: 'get Jwt Token',
    }),
    ApiCreatedResponse({
      schema: {
        example: {
          statusCode: 201,
          data: 'xxxxxxx',
        },
      },
    }),
    ApiUnauthorizedResponse({
      schema: {
        example: {
          statusCode: 401,
          message: ResponseMessages.INVALID_USERNAME_PASSWORD,
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
