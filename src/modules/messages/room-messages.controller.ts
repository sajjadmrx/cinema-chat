import { Controller, Delete, Get, Param, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { MessagesService } from "./messages.service";
import { CheckRoomId } from "../../shared/guards/check-roomId.guard";
import { CheckCurrentMember } from "../../shared/guards/member.guard";
import { getUser } from "../../shared/decorators/user.decorator";
import { CheckMemberPermissions } from "../../shared/guards/permissions.guard";
import { ResponseInterceptor } from "../../shared/interceptors/response.interceptor";

@ApiBearerAuth()
@ApiTags("Room Messages")
@UseInterceptors(ResponseInterceptor)
@UseGuards(CheckCurrentMember)
@UseGuards(CheckRoomId)
@UseGuards(AuthGuard("jwt"))
@Controller("rooms/:roomId/messages")
export class RoomMessagesController {
  constructor(private messagesService: MessagesService) {
  }


  @ApiOperation({
    summary: "fetch room messages by roomId"
  })
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

  @Get("")
  getRoomMessages(@Param("roomId") roomId: string, @Query() query: { page: string; limit: string }) {
    return this.messagesService.getRoomMessages(Number(roomId), Number(query.page), Number(query.limit));
  }

  @ApiOperation({
    summary: "fetch message by MessageID"
  })
  @Get(":messageId")
  getMessage(@Param("roomId") roomId: string, @Param("messageId") messageId: string) {
    return this.messagesService.getByMessageId(Number(messageId));
  }

  // @UseGuards(CheckMemberPermissions(["ADMINISTRATOR",""])
  @ApiOperation({ summary: "delete message By MessageId" })
  @Delete(":messageId")
  delete(
    @Param("roomId") roomId: string,
    @Param("messageId") messageId: string,
    @getUser("userId") userId: number
  ) {
    return this.messagesService.deleteRoomMessage(Number(roomId), userId, Number(messageId));
  }
}
