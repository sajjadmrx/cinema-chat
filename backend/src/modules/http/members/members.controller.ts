import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getUser } from 'src/shared/decorators/user.decorator';
import { CheckRoomId } from 'src/shared/guards/check-roomId.guard';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';
import { User } from 'src/shared/interfaces/user.interface';
import { MemberCreateDto } from './dtos/create.dto';
import { MembersService } from './members.service';
import { CheckCurrentMember } from '../../../shared/guards/member.guard';
import { UpdateCurrentMemberDto } from './dtos/update.dto';
import { getMember } from '../../../shared/decorators/member.decorator';
import {
  Member,
  MemberWithRoom,
} from '../../../shared/interfaces/member.interface';
import { ApiGetAllMembers } from './decorators/getAll.decorator';
import { ApiLaveMember } from './decorators/lave.decorator';
import { ApiKickMember } from './decorators/kick.decorator';
import { ApiJoinRoom } from './decorators/joinRoom.decorator';
import {
  ApiUpdateCurrentMember,
  ApiUpdateMember,
} from './decorators/updateCurrentMember.decorator';
import { ApiGetMemberById } from './decorators/getMemberById.decorator';
import { HttpExceptionFilter } from '../../../shared/filters/httpException.filter';
import { getRoom } from '../../../shared/decorators/room.decorator';
import { Room } from '../../../shared/interfaces/room.interface';

@ApiBearerAuth()
@ApiTags('members')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@UseGuards(CheckRoomId)
@UseGuards(AuthGuard('jwt'))
@Controller('rooms/:roomId/members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @ApiGetAllMembers()
  @UseGuards(CheckCurrentMember)
  getAll(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.membersService.find(roomId, page, limit);
  }

  @ApiJoinRoom()
  async joinRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() input: MemberCreateDto,
    @getUser() user: User,
    @getRoom() room: Room,
  ) {
    return this.membersService.joinRoom(
      roomId,
      Number(input.inviteId),
      user,
      room,
    );
  }

  @ApiLaveMember()
  async lave(
    @Param('roomId', ParseIntPipe) roomId: number,
    @getUser() user: User,
  ) {
    return this.membersService.laveRoom(roomId, user);
  }

  @ApiKickMember()
  async kick(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @getUser() requester: User,
  ) {
    return this.membersService.delete(roomId, Number(memberId), requester);
  }

  @ApiUpdateMember('update current member')
  async updateCurrentMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() input: UpdateCurrentMemberDto,
    @getMember<Member>() requester: MemberWithRoom,
  ) {
    return this.membersService.updateMember(requester.userId, requester, input);
  }

  @ApiUpdateCurrentMember('update a member')
  async updateMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() input: UpdateCurrentMemberDto,
    @getMember<Member>() requester: MemberWithRoom,
  ) {
    return this.membersService.updateMember(memberId, requester, input);
  }

  @ApiGetMemberById()
  async getMemberById(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.membersService.getMember(roomId, memberId);
  }
}
