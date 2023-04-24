import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiDeleteMedia() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'delete a movie' }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: HttpStatus.OK,
          data: ResponseMessages.SUCCESS,
        },
      },
    }),
    ApiNotFoundResponse({
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: ResponseMessages.MOVIE_NOT_FOUND,
          error: 'Not Found',
        },
      },
    }),
    ApiForbiddenResponse({
      schema: {
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: ResponseMessages.PERMISSION_DENIED,
          error: 'Forbidden',
        },
      },
    }),
  );
}
