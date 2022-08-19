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
    private chatService: ChatService
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

      const rooms: { roomId: number }[] =
        await this.roomsRepository.getRoomsIdByUserId(userId);

      rooms.map((r) => client.join(r.roomId.toString()));

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


  private disconnect(socket: Socket) {
    socket.emit("error", new UnauthorizedException());
    socket.disconnect();
  }
}
