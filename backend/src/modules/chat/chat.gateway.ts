import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import {
  forwardRef,
  Inject,
  Logger,
  UnauthorizedException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { WsJwtGuardGuard } from "../../shared/guards/WsJwtGuard.guard";
import { WebsocketExceptionsFilter } from "../../shared/filters/WebsocketExceptions.filter";
import { AuthService } from "../auth/auth.service";
import { RoomsRepository } from "../rooms/rooms.repository";
import { AsyncApiPub, AsyncApiService } from "nestjs-asyncapi";
import { EventKeysConstant } from "../../shared/constants/event-keys.constant";
import { MessageCreateDto } from "../messages/dtos/creates.dto";
import { MembersRepository } from "../members/members.repository";
import { Member } from "../../shared/interfaces/member.interface";
import { MessageUpdateDto } from "../messages/dtos/update.dto";
import { ChatEmits } from "./chat.emits";
import { MemberStatusConstant } from "../../shared/constants/member.constant";
import { StreamNowPlayingDto, StreamPlayDto } from "./dtos/stream.dto";

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
    private membersRepo: MembersRepository,
    @Inject(forwardRef(() => ChatEmits))
    private chatEmits: ChatEmits
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

      members.map((member: Member) => {
        client.join(member.roomId.toString());
        // update User Status
        this.chatEmits.updateMemberStatus(member.roomId, member.userId, MemberStatusConstant.ONLINE);
      });

      client.data.userId = userId;
    } catch (e) {
      this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`IOClient disconnected: ${client.id}`);
    const userId: number = client.data.userId;
    const members: Member[] =
      await this.membersRepo.findByUserId(userId);

    members.map((member: Member) => {
      client.join(member.roomId.toString());
      // update User Status
      this.chatEmits.updateMemberStatus(member.roomId, member.userId, MemberStatusConstant.OFFLINE);
    });
  }

  @AsyncApiPub({
    channel: EventKeysConstant.CREATE_MESSAGE,
    message: { name: "test", payload: { type: MessageCreateDto } },
    tags: [{ name: "message", description: "Messages on room" }],
    description: "call event create Message"
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

  @AsyncApiPub({
    channel: EventKeysConstant.STREAM_GET_CURRENT_PLAYING,
    message: { name: EventKeysConstant.STREAM_GET_CURRENT_PLAYING, payload: { type: StreamNowPlayingDto } },
    tags: [{ name: "stream" }]
  })
  @SubscribeMessage(EventKeysConstant.STREAM_GET_CURRENT_PLAYING)
  onStreamNowPlaying(@MessageBody() data: StreamNowPlayingDto, @ConnectedSocket() socket: Socket) {
    // send request to owner;
    //add targetId to data object => socket.id
  }


  @AsyncApiPub({
    channel:EventKeysConstant.STREAM_FETCH_CURRENT_PLAYING,
    message:{name:EventKeysConstant.STREAM_FETCH_CURRENT_PLAYING, payload:{type:StreamNowPlayingDto}}
  })
  @SubscribeMessage(EventKeysConstant.STREAM_FETCH_CURRENT_PLAYING)
  onStreamFetchCurrentPlaying(){
    // callback owner
    // send current playing to target with data.target
  }



  @AsyncApiPub({
    channel: EventKeysConstant.STREAM_PLAY,
    message: { name: EventKeysConstant.STREAM_PLAY, payload: { type: StreamPlayDto } },
    tags: [{ name: "stream" }]
  })
  @SubscribeMessage(EventKeysConstant.STREAM_PLAY)
  onStreamPlay(@MessageBody() data: StreamPlayDto, @ConnectedSocket() socket: Socket) {
    //send broadcast to room
  }


  private disconnect(socket: Socket) {
    socket.emit("error", new UnauthorizedException());
    socket.disconnect();
  }
}
