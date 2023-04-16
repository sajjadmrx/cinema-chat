import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
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
import { CheckCurrentMember } from '../../shared/guards/member.guard';
import { CheckMemberPermissions } from '../../shared/guards/member-permissions.guard';
import { UpdateCurrentMemberDto } from './dtos/update.dto';
import { getMember } from '../../shared/decorators/member.decorator';
import {
  Member,
  MemberWithRoom,
} from '../../shared/interfaces/member.interface';
import { ApiGetAllMembers } from './docs/getAll.doc';
import { ApiLaveMember } from './docs/lave.doc';
import { ApiKickMember } from './docs/kick.doc';
import { ApiJoinRoom } from './docs/joinRoom.doc';
import { ApiUpdateMember } from './docs/updateCurrentMember.doc';
import { ApiGetMemberById } from './docs/getMemberById.doc';

@ApiBearerAuth()
@ApiTags('members')
@UseInterceptors(ResponseInterceptor)
@UseGuards(CheckRoomId)
@UseGuards(AuthGuard('jwt'))
@Controller('rooms/:roomId/members')
export class MembersController {
  constructor(private membersService: MembersService) {}

  @ApiGetAllMembers()
  @UseGuards(CheckCurrentMember)
  @Get()
  getAll(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.membersService.find(roomId, page, limit);
  }

  @ApiJoinRoom()
  @Put()
  async joinRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() input: MemberCreateDto,
    @getUser() user: User,
  ) {
    return this.membersService.joinRoom(roomId, Number(input.inviteId), user);
  }

  @ApiLaveMember()
  @Put('/lave')
  async lave(
    @Param('roomId', ParseIntPipe) roomId: number,
    @getUser() user: User,
  ) {
    return this.membersService.laveRoom(roomId, user);
  }

  @ApiKickMember()
  @UseGuards(CheckMemberPermissions(['ADMINISTRATOR', 'MANAGE_MEMBERS']))
  @UseGuards(CheckCurrentMember)
  @Delete('/:memberId')
  async kick(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @getUser() requester: User,
  ) {
    return this.membersService.delete(roomId, Number(memberId), requester);
  }

  @ApiUpdateMember('update current member')
  @UseGuards(CheckCurrentMember)
  @Patch()
  async updateCurrentMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() input: UpdateCurrentMemberDto,
    @getMember<Member>() requester: MemberWithRoom,
  ) {
    return this.membersService.updateMember(requester.userId, requester, input);
  }

  @ApiUpdateMember('update a member')
  @UseGuards(CheckCurrentMember)
  @Patch(':memberId')
  async updateMember(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() input: UpdateCurrentMemberDto,
    @getMember<Member>() requester: MemberWithRoom,
  ) {
    return this.membersService.updateMember(memberId, requester, input);
  }

  @ApiGetMemberById()
  @UseGuards(CheckCurrentMember)
  @Get(':memberId')
  async getMemberById(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.membersService.getMember(roomId, memberId);
  }
}
