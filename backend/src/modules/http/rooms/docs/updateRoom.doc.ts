import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiUpdateRoom() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'update room',
      description:
        'update a room by roomId,required Permissions:"ADMINISTRATOR" or "MANAGE_ROOM"',
    }),
    ApiNotFoundResponse({
      schema: {
        example: {
          statusCode: 404,
          message: ResponseMessages.ROOM_NOT_FOUND,
          error: 'Not Found',
        },
      },
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: 200,
          data: ResponseMessages.SUCCESS,
        },
      },
    }),
    ApiForbiddenResponse({
      schema: {
        example: {
          statusCode: 403,
          message: ResponseMessages.PERMISSION_DENIED,
          error: 'Forbidden',
        },
      },
    }),
    ApiParam({ name: 'roomId', type: 'string', example: '12345' }),
  );
}
