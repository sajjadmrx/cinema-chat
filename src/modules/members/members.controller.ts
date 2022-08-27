import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CheckMemberPermissions } from "../../shared/guards/permissions.guard";
import { KickDto } from "./dtos/kick.dto";
import { UpdateCurrentMemberDto } from "./dtos/update.dto";
import { getMember } from "../../shared/decorators/member.decorator";
import {
  Member,
  MemberWithRoom
} from "../../shared/interfaces/member.interface";

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
    type: String,
    required: false,
    example: 10
  })
  @ApiQuery({
    name: "page",
    type: String,
    required: false,
    example: 1
  })
  @ApiOperation({ summary: "Get Members" })
  @UseGuards(CheckCurrentMember)
  @Get()
  getAll(
    @Param("roomId") roomId: string,
    @Query() query: { page: string; limit: string }
  ) {
    return this.membersService.find(
      Number(roomId),
      Number(query.page),
      Number(query.limit)
    );
  }

  @ApiOperation({ summary: "Add Current user to room" })
  @Put()
  async joinRoom(
    @Param("roomId") roomId: string,
    @Body() input: MemberCreateDto,
    @getUser() user: User
  ) {
    return this.membersService.joinRoom(
      Number(roomId),
      Number(input.inviteId),
      user
    );
  }

  @ApiOperation({ summary: "lave Current user from room" })
  @Delete("/lave")
  async lave(@Param("roomId") roomId: string, @getUser() user: User) {
    return this.membersService.laveRoom(Number(roomId), user);
  }

  @ApiOperation({
    summary: "delete a member",
    description: "required permissions: 'ADMINISTRATOR' or 'MANAGE_MEMBERS'"
  })
  @UseGuards(CheckMemberPermissions(["ADMINISTRATOR", "MANAGE_MEMBERS"]))
  @UseGuards(CheckCurrentMember)
  @Delete()
  async kick(
    @Param("roomId") roomId: string,
    @Body() input: KickDto,
    @getUser() requester: User
  ) {
    return this.membersService.delete(
      Number(roomId),
      Number(input.memberId),
      requester
    );
  }

  @ApiOperation({ summary: "update current member" })
  @UseGuards(CheckCurrentMember)
  @Patch()
  async updateCurrentMember(
    @Param("roomId") roomId: string,
    @Body() input: UpdateCurrentMemberDto,
    @getMember<Member>() requester: MemberWithRoom
  ) {
    return this.membersService.updateMember(requester.userId, requester, input);
  }

  @ApiOperation({ summary: "update a member" })
  @UseGuards(CheckCurrentMember)
  @Patch(":memberId")
  async updateMember(
    @Param("roomId") roomId: string,
    @Param("memberId") memberId: string,
    @Body() input: UpdateCurrentMemberDto,
    @getMember<Member>() requester: MemberWithRoom
  ) {
    return this.membersService.updateMember(Number(memberId), requester, input);
  }

  @ApiOperation({ summary: "fetch member by MemberId" })
  @UseGuards(CheckCurrentMember)
  @Get(":memberId")
  async getMemberById(
    @Param("roomId") roomId: string,
    @Param("memberId") memberId: string
  ) {
    return this.membersService.getMember(Number(roomId), Number(memberId));
  }
}
