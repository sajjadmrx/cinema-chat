import {
  Body,
  Controller,
  Delete,
  Get,
  Param, ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import { getUser } from "src/shared/decorators/user.decorator";
import { CheckRoomId } from "src/shared/guards/check-roomId.guard";
import { ResponseInterceptor } from "src/shared/interceptors/response.interceptor";
import { User } from "src/shared/interfaces/user.interface";
import { MemberCreateDto } from "./dtos/create.dto";
import { MembersService } from "./members.service";
import { CheckCurrentMember } from "../../shared/guards/member.guard";
import { CheckMemberPermissions } from "../../shared/guards/member-permissions.guard";
import { KickDto } from "./dtos/kick.dto";
import { UpdateCurrentMemberDto } from "./dtos/update.dto";
import { getMember } from "../../shared/decorators/member.decorator";
import {
  Member,
  MemberWithRoom
} from "../../shared/interfaces/member.interface";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";

@ApiBearerAuth()
@ApiTags("members")
@UseInterceptors(ResponseInterceptor)
@UseGuards(CheckRoomId)
@UseGuards(AuthGuard("jwt"))
@Controller("rooms/:roomId/members")
export class MembersController {
  constructor(private membersService: MembersService) {
  }

  @ApiQuery({
    name: "limit",
    type: Number,
    required: true,
    example: 10
  })
  @ApiQuery({
    name: "page",
    type: Number,
    required: true,
    example: 1
  })
  @ApiOperation({ summary: "Get Members" })
  @UseGuards(CheckCurrentMember)
  @Get()
  getAll(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number
  ): Promise<Member[]> {
    return this.membersService.find(
      roomId,
      page,
      limit
    );
  }

  @ApiOperation({ summary: "Add Current user to room" })
  @Put()
  async joinRoom(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Body() input: MemberCreateDto,
    @getUser() user: User
  ) {
    return this.membersService.joinRoom(
      roomId,
      Number(input.inviteId),
      user
    );
  }

  @ApiOperation({ summary: "lave Current user from room" })
  @Delete("/lave")
  async lave(@Param("roomId", ParseIntPipe) roomId: number, @getUser() user: User): Promise<ResponseMessages> {
    return this.membersService.laveRoom(roomId, user);
  }

  @ApiOperation({
    summary: "delete a member",
    description: "required permissions: 'ADMINISTRATOR' or 'MANAGE_MEMBERS'"
  })
  @UseGuards(CheckMemberPermissions(["ADMINISTRATOR", "MANAGE_MEMBERS"]))
  @UseGuards(CheckCurrentMember)
  @Delete()
  async kick(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Body() input: KickDto,
    @getUser() requester: User
  ): Promise<ResponseMessages> {
    return this.membersService.delete(
      roomId,
      Number(input.memberId),
      requester
    );
  }

  @ApiOperation({ summary: "update current member" })
  @UseGuards(CheckCurrentMember)
  @Patch()
  async updateCurrentMember(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Body() input: UpdateCurrentMemberDto,
    @getMember<Member>() requester: MemberWithRoom
  ): Promise<ResponseMessages> {
    return this.membersService.updateMember(requester.userId, requester, input);
  }

  @ApiOperation({ summary: "update a member" })
  @UseGuards(CheckCurrentMember)
  @Patch(":memberId")
  async updateMember(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Param("memberId", ParseIntPipe) memberId: number,
    @Body() input: UpdateCurrentMemberDto,
    @getMember<Member>() requester: MemberWithRoom
  ): Promise<ResponseMessages> {
    return this.membersService.updateMember(memberId, requester, input);
  }

  @ApiOperation({ summary: "fetch member by MemberId" })
  @UseGuards(CheckCurrentMember)
  @Get(":memberId")
  async getMemberById(
    @Param("roomId", ParseIntPipe) roomId: number,
    @Param("memberId", ParseIntPipe) memberId: number
  ): Promise<Member> {
    return this.membersService.getMember(roomId, memberId);
  }
}
