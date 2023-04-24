import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';

export function ApiGetMemberById() {
  return applyDecorators(
    ApiOperation({ summary: 'fetch member by MemberId' }),
    ApiNotFoundResponse({
      schema: {
        example: {
          statusCode: HttpStatus.NOT_FOUND,
          message: ResponseMessages.MEMBER_NOT_FOUND,
          error: 'Not Found',
        },
      },
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: HttpStatus.OK,
          data: {
            id: '62fb634b450c3733a4e2080b',
            roomId: 44117771,
            userId: 925674628193,
            inviteId: null,
            permissions: ['ADMINISTRATOR', 'DEFAULT'],
            nickname: 'wwww',
            createdAt: '2022-08-16T09:28:43.546Z',
            updatedAt: '2022-08-16T13:21:38.579Z',
            room: {
              id: '62fb634b450c3733a4e2080a',
              roomId: 44117771,
              ownerId: 925674628193,
              name: 'relaxing',
              isPublic: false,
              avatar: 'DEFAULT_AVATAR',
              createdAt: '2022-08-16T09:28:43.546Z',
              updatedAt: '2022-08-16T09:28:43.546Z',
            },
          },
        },
      },
    }),
  );
}
