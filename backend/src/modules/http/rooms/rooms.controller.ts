import {
  Body,
  Controller,
  Param,
  UseInterceptors,
  Query,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { RoomCreateDto } from './dto/create.dto';
import { getUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/shared/interfaces/user.interface';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { RoomUpdateDto } from './dto/update.dto';

import { ApiGetRooms } from './decorators/getRooms.doc';
import { ApiGetUserRooms } from './decorators/getUserRooms.doc';
import { ApiCreateRoom } from './decorators/createRoom.decorator';
import { ApiUpdateRoom } from './decorators/updateRoom.doc';
import { HttpExceptionFilter } from '../../../shared/filters/httpException.filter';

@ApiTags('rooms')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @ApiGetRooms()
  async getRooms(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.roomsService.getPublicRooms(page, limit);
  }

  @ApiGetUserRooms()
  async getUserRooms(
    @getUser() user: User,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.roomsService.getUserRooms(user.userId, page, limit);
  }

  @ApiCreateRoom()
  async create(@Body() data: RoomCreateDto, @getUser() user: User) {
    return this.roomsService.create(data, user);
  }

  @ApiUpdateRoom()
  async update(
    @Body() data: RoomUpdateDto,
    @Param('roomId', ParseIntPipe) roomId: number,
    @getUser('userId') userId: number,
  ) {
    return this.roomsService.update(roomId, userId, data);
  }
}
