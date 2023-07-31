import { applyDecorators, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseMessages } from '../../../../shared/constants/response-messages.constant';
import { CheckMemberPermissions } from '../../../../shared/guards/member-permissions.guard';
import { CheckCurrentMember } from '../../../../shared/guards/member.guard';

export function ApiKickMember() {
  return applyDecorators(
    ApiOperation({
      summary: 'delete a member',
      description: "required permissions: 'ADMINISTRATOR' or 'MANAGE_MEMBERS'",
    }),
    ApiBadRequestResponse({
      schema: {
        example: {
          'This error occurs when the user is not a member of the room.': {
            statusCode: 400,
            message: ResponseMessages.USER_NOT_MEMBER,
            error: 'Bad Request',
          },
          'This error occurs when the user tries to kick themselves from the room':
            {
              statusCode: 400,
              message: ResponseMessages.CANNOT_KICK_SELF,
              error: 'Bad Request',
            },
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
    UseGuards(CheckMemberPermissions(['ADMINISTRATOR', 'MANAGE_MEMBERS'])),
    UseGuards(CheckCurrentMember),
    Delete('/:memberId'),
  );
}
