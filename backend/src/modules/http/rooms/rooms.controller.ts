import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  Query,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { RoomCreateDto } from './dto/create.dto';
import { getUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/shared/interfaces/user.interface';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { RoomUpdateDto } from './dto/update.dto';
import { CheckRoomId } from 'src/shared/guards/check-roomId.guard';
import { CheckCurrentMember } from '../../../shared/guards/member.guard';
import { CheckMemberPermissions } from '../../../shared/guards/member-permissions.guard';
import { ApiGetRooms } from './docs/getRooms.doc';
import { ApiGetUserRooms } from './docs/getUserRooms.doc';
import { ApiCreateRoom } from './docs/createRoom.doc';
import { ApiUpdateRoom } from './docs/updateRoom.doc';
import { HttpExceptionFilter } from '../../../shared/filters/httpException.filter';

@ApiTags('rooms')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @ApiGetRooms()
  @Get()
  async getRooms(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.roomsService.getPublicRooms(page, limit);
  }

  @ApiGetUserRooms()
  @UseGuards(AuthGuard('jwt'))
  @Get('@me')
  async getUserRooms(
    @getUser() user: User,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.roomsService.getUserRooms(user.userId, page, limit);
  }

  @ApiCreateRoom()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() data: RoomCreateDto, @getUser() user: User) {
    return this.roomsService.create(data, user);
  }

  @ApiUpdateRoom()
  @UseGuards(CheckMemberPermissions(['ADMINISTRATOR', 'MANAGE_ROOM']))
  @UseGuards(CheckCurrentMember)
  @UseGuards(CheckRoomId)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':roomId')
  async update(
    @Body() data: RoomUpdateDto,
    @Param('roomId', ParseIntPipe) roomId: number,
    @getUser('userId') userId: number,
  ) {
    return this.roomsService.update(roomId, userId, data);
  }
}
