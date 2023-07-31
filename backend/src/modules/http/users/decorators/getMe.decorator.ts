import { applyDecorators, Get, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiGetMe() {
  return applyDecorators(
    ApiOperation({
      summary: 'get current user data',
    }),
    ApiOkResponse({
      schema: {
        example: {
          statusCode: HttpStatus.OK,
          data: {
            id: '6309b988f06fc80bca9e1b22',
            userId: 692869485481,
            email: 'fake@gmail.com',
            username: 'sajjadmrx',
            permissions: ['ADMINISTRATOR'],
            createdAt: '2022-08-27T06:28:24.870Z',
            updatedAt: '2022-09-07T08:41:05.801Z',
          },
        },
      },
    }),
    Get('/'),
  );
}
