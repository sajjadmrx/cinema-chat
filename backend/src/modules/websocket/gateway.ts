import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import { FetchOnlineMembersPayload } from './payloads/member.payload';
import {
  WsEventCallbackCurrentPlaying,
  WsEventCreateMessage,
  WsEventFetchOnlineMembers,
  WsEventGetCurrentPlaying,
  WsEventStreamPlay,
  WsEventStreamSeek,
  WsEventStreamTogglePlay,
  WsEventUpdateMessage,
} from './decorators/events.decorator';

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

  @WsEventCreateMessage()
  onCreateMessage(
    @MessageBody() data: MessageCreateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.sendMessageRoom(data, socket);
  }

  @WsEventUpdateMessage()
  onUpdateMessage(
    @MessageBody() data: MessageUpdateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.updateMessageRoom(data, socket);
  }

  @WsEventGetCurrentPlaying()
  onGetCurrentPlaying(
    @MessageBody() data: GetCurrentPlayingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.getCurrentPlaying(data, socket);
  }

  @WsEventCallbackCurrentPlaying()
  onStreamCbCurrentPlaying(
    @MessageBody() data: StreamNowPlayingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.cbCurrentPlaying(data, socket);
  }

  @WsEventStreamPlay()
  onStreamPlay(
    @MessageBody() data: StreamPlayDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.play(socket, data);
  }

  @WsEventStreamTogglePlay()
  onTogglePlay(
    @MessageBody() data: StreamTogglePlay,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.onTogglePlay(data, socket);
  }

  @WsEventStreamSeek()
  onSeek(
    @MessageBody() data: StreamTogglePlay,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.seek(data as any, socket);
  }

  @WsEventFetchOnlineMembers()
  onFetchMembersStatus(
    @MessageBody() data: FetchOnlineMembersPayload,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.fetchOnlineMembers(data.roomId.toString(), socket);
  }
}
