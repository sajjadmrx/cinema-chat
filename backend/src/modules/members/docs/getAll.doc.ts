import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';

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
                id: '6309b99bf06fc80bca9e1b24',
                roomId: 26297437,
                userId: 692869485481,
                inviteId: null,
                permissions: ['ADMINISTRATOR'],
                nickname: null,
                createdAt: '2022-08-27T06:28:43.168Z',
                updatedAt: '2022-08-27T06:28:43.168Z',
              },
              {
                id: '63720ea023e7055f849c80f3',
                roomId: 26297437,
                userId: 153875157545,
                inviteId: 0,
                permissions: ['DEFAULT'],
                nickname: null,
                createdAt: '2022-11-14T09:47:12.370Z',
                updatedAt: '2022-11-14T09:47:12.370Z',
              },
              {
                id: '6432aedebd23096a1563a37a',
                roomId: 26297437,
                userId: 925674628193,
                inviteId: 0,
                permissions: ['DEFAULT'],
                nickname: 'test',
                createdAt: '2023-04-09T12:26:06.944Z',
                updatedAt: '2023-04-09T12:58:21.339Z',
              },
              {
                id: '6432c9d562786fddbafcdaa0',
                roomId: 26297437,
                userId: 953154375831,
                inviteId: 0,
                permissions: ['DEFAULT'],
                nickname: null,
                createdAt: '2023-04-09T14:21:09.509Z',
                updatedAt: '2023-04-09T14:21:09.509Z',
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
