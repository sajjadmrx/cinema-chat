import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect, SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import {
  forwardRef,
  Inject,
  Injectable,
  Logger, NotFoundException,
  UnauthorizedException,
  UseFilters,
  UseGuards, UsePipes, ValidationPipe
} from "@nestjs/common";
import { WsJwtGuardGuard } from "../../shared/guards/WsJwtGuard.guard";
import { WebsocketExceptionsFilter } from "../../shared/filters/WebsocketExceptions.filter";
import { AuthService } from "../auth/auth.service";
import { RoomsRepository } from "../rooms/rooms.repository";
import { AsyncApiPub, AsyncApiService, AsyncApiSub } from "nestjs-asyncapi";
import { EventKeysConstant } from "../../shared/constants/event-keys.constant";
import { MessageCreateDto } from "../messages/dtos/creates.dto";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";
import { MembersRepository } from "../members/members.repository";
import { Member } from "../../shared/interfaces/member.interface";
import { MessageUpdateDto } from "../messages/dtos/update.dto";

@AsyncApiService()
@UsePipes(new ValidationPipe())
@UseGuards(WsJwtGuardGuard)
@UseFilters(WebsocketExceptionsFilter)
@WebSocketGateway(81, {
  transports: ["websocket"]
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  server: Server;

  public onlineUsers = new Map();

  constructor(
    private authService: AuthService,
    private roomsRepository: RoomsRepository,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private membersRepo: MembersRepository
  ) {
  }

  async handleConnection(client: Socket) {
    try {
      const authorization: string | null =
        client.handshake.headers["authorization"];
      if (!authorization) throw new UnauthorizedException();
      let token: string | null = authorization.split(" ")[1];
      const result = this.authService.jwtVerify(token);
      const userId = result.userId;

      const members: Member[] =
        await this.membersRepo.findByUserId(userId);

      members.map((member: Member) => client.join(member.roomId.toString()));

      client.data.userId = userId;
    } catch (e) {
      this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`IOClient disconnected: ${client.id}`);
  }

  @AsyncApiPub({
    channel: EventKeysConstant.CREATE_MESSAGE,
    message: { name: "test", payload: { type: MessageCreateDto } },
    tags: [{ name: "message", description: "Messages on room" }]
  })
  @SubscribeMessage(EventKeysConstant.CREATE_MESSAGE)
  onCreateMessage(@MessageBody() data: MessageCreateDto, @ConnectedSocket() socket: Socket) {
    return this.chatService.sendMessageRoom(data, socket);
  }

  @AsyncApiPub({
    channel: EventKeysConstant.UPDATE_MESSAGE,
    message: { name: "UPDATE_MESSAGE", payload: { type: MessageUpdateDto } },
    tags: [{ name: "message" }]
  })
  @SubscribeMessage(EventKeysConstant.UPDATE_MESSAGE)
  onUpdateMessage(@MessageBody() data: MessageUpdateDto, @ConnectedSocket() socket: Socket) {
    return this.chatService.updateMessageRoom(data, socket);
  }

  private disconnect(socket: Socket) {
    socket.emit("error", new UnauthorizedException());
    socket.disconnect();
  }
}
