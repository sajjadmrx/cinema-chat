import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiGetAllMembers() {
  return applyDecorators(
    ApiQuery({
      name: 'limit',
      type: Number,
      required: true,
      example: 10,
    }),
    ApiQuery({
      name: 'page',
      type: Number,
      required: true,
      example: 1,
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: 200,
          data: {
            totalMembers: 4,
            totalPages: 1,
            nextPage: null,
            members: [
              {
                id: '644b02f8441b23df0b82d632',
                roomId: 89227633,
                userId: 825195179646,
                inviteId: null,
                permissions: ['ADMINISTRATOR'],
                nickname: null,
                createdAt: '2023-04-27T23:19:20.487Z',
                updatedAt: '2023-04-27T23:19:20.487Z',
                user: {
                  userId: 825195179646,
                  permissions: ['USER'],
                  username: 'ali',
                },
              },
            ],
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description:
        'User is not a member of the room and does not have access to the room',
      schema: {
        example: {
          statusCode: 403,
          message: ResponseMessages.USER_NOT_MEMBER,
          error: 'Forbidden',
        },
      },
    }),
    ApiOperation({ summary: 'Get Members' }),
  );
}
