import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { getUser } from 'src/shared/decorators/user.decorator';
import { CheckRoomId } from 'src/shared/guards/check-roomId.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { User } from 'src/shared/interfaces/user.interface';
import { MemberCreateDto } from './dtos/create.dto';
import { MembersService } from './members.service';

@ApiBearerAuth()
@ApiTags('member')
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard('jwt'))
@UseGuards(CheckRoomId)
@Controller('rooms/:roomId/members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @ApiOperation({ summary: 'Add Current user to room' })
  @Put()
  async joinRoom(
    @Param('roomId') roomId: string,
    @Body() input: MemberCreateDto,
    @getUser() user: User,
  ) {
    return this.membersService.joinRoom(
      Number(roomId),
      Number(input.inviteId),
      user,
    );
  }
}
