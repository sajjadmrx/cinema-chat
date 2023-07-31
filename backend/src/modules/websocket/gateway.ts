import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './services/chat.service';
import {
  forwardRef,
  Inject,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../../shared/filters/WebsocketExceptions.filter';
import { AsyncApiService } from 'nestjs-asyncapi';
import { SocketKeys } from '../../shared/constants/socket.keys';
import { MessageCreateDto } from '../http/messages/dtos/creates.dto';
import { MessageUpdateDto } from '../http/messages/dtos/update.dto';
import {
  GetCurrentPlayingDto,
  StreamNowPlayingDto,
  StreamPlayDto,
  StreamTogglePlay,
} from './dtos/stream.dto';
import { ConnectionService } from './services/connection.service';
import { StreamEventService } from './services/stream.service';
import {
  FetchOnlineMembersPayload,
  UpdateMemberStatusPayload,
} from './payloads/member.payload';
import {
  WsEventCallbackCurrentPlaying,
  WsEventCreateMessage,
  WsEventFetchOnlineMembers,
  WsEventGetCurrentPlaying,
  WsEventStreamPlay,
  WsEventStreamSeek,
  WsEventStreamTogglePlay,
  WsEventUpdateMessage,
} from './docs/events.doc';

@AsyncApiService()
@UsePipes(new ValidationPipe())
@UseFilters(WebsocketExceptionsFilter)
@WebSocketGateway(81, {
  transports: ['websocket'],
  cors: {
    origin: '*',
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger(Gateway.name);
  @WebSocketServer()
  server: Server;
  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,

    private connectionService: ConnectionService,
    private streamEventService: StreamEventService,
  ) {}

  async handleConnection(client: Socket) {
    return this.connectionService.handleConnection(client);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    return this.connectionService.handleDisconnect(client);
  }

  @WsEventUpdateMessage()
  @SubscribeMessage(SocketKeys.UPDATE_MESSAGE)
  onUpdateMessage(
    @MessageBody() data: MessageUpdateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.updateMessageRoom(data, socket);
  }

  @WsEventGetCurrentPlaying()
  @SubscribeMessage(SocketKeys.STREAM_GET_CURRENT_PLAYING)
  onGetCurrentPlaying(
    @MessageBody() data: GetCurrentPlayingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.getCurrentPlaying(data, socket);
  }

  @WsEventCallbackCurrentPlaying()
  @SubscribeMessage(SocketKeys.STREAM_CB_CURRENT_PLAYING)
  onStreamCbCurrentPlaying(
    @MessageBody() data: StreamNowPlayingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.cbCurrentPlaying(data, socket);
  }

  @WsEventStreamPlay()
  @SubscribeMessage(SocketKeys.STREAM_PLAY)
  onStreamPlay(
    @MessageBody() data: StreamPlayDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.play(socket, data);
  }

  @WsEventStreamTogglePlay()
  @SubscribeMessage(SocketKeys.STREAM_TOGGLE_PLAY)
  onTogglePlay(
    @MessageBody() data: StreamTogglePlay,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.onTogglePlay(data, socket);
  }

  @WsEventStreamSeek()
  @SubscribeMessage(SocketKeys.STREAM_SEEK)
  onSeek(
    @MessageBody() data: StreamTogglePlay,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.seek(data as any, socket);
  }

  @WsEventFetchOnlineMembers()
  @SubscribeMessage(SocketKeys.FETCH_ONLINE_MEMBERS)
  onFetchMembersStatus(
    @MessageBody() data: FetchOnlineMembersPayload,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.fetchOnlineMembers(data.roomId.toString(), socket);
  }
}
