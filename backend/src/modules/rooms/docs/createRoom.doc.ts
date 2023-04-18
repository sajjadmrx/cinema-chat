import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';

export function ApiCreateRoom() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'create a room',
    }),
    ApiResponse({
      status: 201,
      schema: {
        example: { statusCode: 201, data: { roomId: 57635829 } },
      },
    }),
    ApiResponse({
      status: 500,
      schema: {
        example: {
          statusCode: 500,
          message: ResponseMessages.SERVER_ERROR,
        },
      },
    }),
  );
}
