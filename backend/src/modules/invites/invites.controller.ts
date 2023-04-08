import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';
import { InviteCreateDto } from './dtos/create.dto';
import { getUser } from 'src/shared/decorators/user.decorator';
import { Room } from '../../shared/interfaces/room.interface';

@ApiTags('Invites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ResponseInterceptor)
@Controller('invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @ApiOperation({
    summary: 'create invite',
    description: 'Create an invitation code to join the room',
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        statusCode: 201,
        data: 'xw161ca1fa',
      },
    },
  })
  @ApiResponse({
    status: 400,
    schema: {
      example: {
        statusCode: 400,
        message: 'ROOM_NOT_FOUND',
      },
    },
  })
  @Post()
  async create(
    @Body() data: InviteCreateDto,
    @getUser('userId') userId: number,
  ): Promise<string> {
    return this.invitesService.create(data, userId);
  }

  @ApiOperation({
    summary: 'find room by slug',
  })
  @ApiResponse({
    status: 200,
    description: 'Find room By Slug',
    schema: {
      example: {
        statusCode: 200,
        data: {
          roomId: 26297437,
          ownerId: 692869485481,
          name: 'relaxing',
          isPublic: false,
          avatar: 'DEFAULT_AVATAR',
          createdAt: '2022-08-27T06:28:43.142Z',
          updatedAt: '2022-08-27T06:28:43.142Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        statusCode: 404,
        message: 'INVALID_INVITE',
      },
    },
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'When the Expire time expired',
    schema: {
      example: {
        statusCode: 400,
        message: 'EXPIRED_TIME',
      },
    },
  })
  @ApiParam({ name: 'slug', type: String })
  @Get(':slug')
  async findRoom(@Param('slug') slug: string): Promise<Room> {
    return this.invitesService.findRoom(slug);
  }
}
