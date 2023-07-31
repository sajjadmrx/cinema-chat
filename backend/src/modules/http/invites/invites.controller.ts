import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { ResponseInterceptor } from '../../../shared/interceptors/response.interceptor';
import { InviteCreateDto } from './dtos/create.dto';
import { getUser } from 'src/shared/decorators/user.decorator';
import { ApiCreateInvite } from './decorators/create.decorator';
import { ApiFindRoomInvite } from './decorators/findRoom.decorator';
import { HttpExceptionFilter } from '../../../shared/filters/httpException.filter';

@ApiTags('Invites')
@ApiBearerAuth()
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ResponseInterceptor)
@Controller('invites')
export class InvitesController {
  constructor(private invitesService: InvitesService) {}

  @ApiCreateInvite()
  async create(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() data: InviteCreateDto,
    @getUser('userId') userId: number,
  ) {
    return this.invitesService.create(roomId, data, userId);
  }

  @ApiFindRoomInvite()
  async findRoom(@Param('slug') slug: string) {
    return this.invitesService.findRoom(slug);
  }
}
