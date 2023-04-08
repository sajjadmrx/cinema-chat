import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { RoomCreateDto } from './dto/create.dto';
import { getUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/shared/interfaces/user.interface';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { RoomUpdateDto } from './dto/update.dto';
import { CheckRoomId } from 'src/shared/guards/check-roomId.guard';
import { CheckCurrentMember } from '../../shared/guards/member.guard';
import { CheckMemberPermissions } from '../../shared/guards/member-permissions.guard';
import { Room } from '../../shared/interfaces/room.interface';
import { ResponseMessages } from '../../shared/constants/response-messages.constant';

@UseInterceptors(ResponseInterceptor)
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @ApiOperation({
    summary: 'get public rooms',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
  })
  @Get()
  async getRooms(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.roomsService.getPublicRooms(page, limit);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get current User Rooms',
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: String,
    required: false,
    example: 1,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('@me')
  async getUserRooms(
    @getUser() user: User,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Room[]> {
    return this.roomsService.getUserRooms(user.userId, page, limit);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'create a room',
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: { statusCode: 201, data: { roomId: 57635829 } },
    },
  })
  @ApiResponse({
    status: 500,
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() data: RoomCreateDto, @getUser() user: User) {
    return this.roomsService.create(data, user);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'update room',
    description:
      'update a room by roomId,required Permissions:"ADMINISTRATOR" or "MANAGE_ROOM"',
  })
  @ApiParam({ name: 'roomId', type: 'string', example: '12345' })
  @UseGuards(CheckMemberPermissions(['ADMINISTRATOR', 'MANAGE_ROOM']))
  @UseGuards(CheckCurrentMember)
  @UseGuards(CheckRoomId)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':roomId')
  async update(
    @Body() data: RoomUpdateDto,
    @Param('roomId', ParseIntPipe) roomId: number,
    @getUser('userId') userId: number,
  ): Promise<ResponseMessages> {
    return this.roomsService.update(roomId, userId, data);
  }
}
