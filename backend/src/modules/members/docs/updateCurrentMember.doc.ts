import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';

export function ApiUpdateMember(summary: string) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiForbiddenResponse({
      schema: {
        example: {
          statusCode: HttpStatus.FORBIDDEN,
          message: ResponseMessages.PERMISSION_DENIED,
          error: 'Forbidden',
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
    ApiBadRequestResponse({
      schema: {
        example: {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ResponseMessages.INVALID_PERMISSION,
        },
      },
    }),
  );
}
