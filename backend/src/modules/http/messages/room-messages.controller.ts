import {
  Controller,
  Param,
  ParseIntPipe,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';
import { CheckRoomId } from '../../../shared/guards/check-roomId.guard';
import { CheckCurrentMember } from '../../../shared/guards/member.guard';
import { getUser } from '../../../shared/decorators/user.decorator';
import { ResponseInterceptor } from '../../../shared/interceptors/response.interceptor';
import { ApiGetRoomMessages } from './decorators/getRoomMsgs.decorator';
import { ApiGetMessage } from './decorators/getMessage.decorator';
import { ApiDeleteMessage } from './decorators/delete-msg.decorator';
import { HttpExceptionFilter } from '../../../shared/filters/httpException.filter';

@ApiBearerAuth()
@ApiTags('Room Messages')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@UseGuards(CheckCurrentMember)
@UseGuards(CheckRoomId)
@UseGuards(AuthGuard('jwt'))
@Controller('rooms/:roomId/messages')
export class RoomMessagesController {
  constructor(private messagesService: MessagesService) {}

  @ApiGetRoomMessages()
  getRoomMessages(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Query() query: { page: string; limit: string },
  ) {
    return this.messagesService.getRoomMessages(
      roomId,
      Number(query.page),
      Number(query.limit),
    );
  }

  @ApiGetMessage()
  getMessage(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    return this.messagesService.getByMessageId(messageId);
  }

  // @UseGuards(CheckMemberPermissions(["ADMINISTRATOR",""])
  @ApiDeleteMessage()
  delete(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @getUser('userId') userId: number,
  ) {
    return this.messagesService.deleteRoomMessage(roomId, userId, messageId);
  }
}
