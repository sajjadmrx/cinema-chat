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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../../shared/filters/WebsocketExceptions.filter';
import { AsyncApiPub, AsyncApiService } from 'nestjs-asyncapi';
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
import { MoviesRepository } from '../http/movies/movies.repository';
import { UpdateMemberStatusPayload } from './payloads/member.payload';
import { PickType } from '@nestjs/swagger';

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
    private movieRepository: MoviesRepository,
  ) {}

  async handleConnection(client: Socket) {
    return this.connectionService.handleConnection(client);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    return this.connectionService.handleDisconnect(client);
  }

  @AsyncApiPub({
    channel: SocketKeys.CREATE_MESSAGE,
    message: { name: 'test', payload: { type: MessageCreateDto } },
    tags: [{ name: 'message', description: 'Messages on room' }],
    description: 'call event create Message',
  })
  @SubscribeMessage(SocketKeys.CREATE_MESSAGE)
  onCreateMessage(
    @MessageBody() data: MessageCreateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.sendMessageRoom(data, socket);
  }

  @AsyncApiPub({
    channel: SocketKeys.UPDATE_MESSAGE,
    message: { name: 'UPDATE_MESSAGE', payload: { type: MessageUpdateDto } },
    tags: [{ name: 'message' }],
  })
  @SubscribeMessage(SocketKeys.UPDATE_MESSAGE)
  onUpdateMessage(
    @MessageBody() data: MessageUpdateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.updateMessageRoom(data, socket);
  }

  @AsyncApiPub({
    channel: SocketKeys.STREAM_GET_CURRENT_PLAYING,
    message: {
      name: SocketKeys.STREAM_GET_CURRENT_PLAYING,
      payload: { type: GetCurrentPlayingDto },
    },
    tags: [{ name: 'stream' }],
    summary: `Get the current stream with response in the event: ${SocketKeys.STREAM_CB_CURRENT_PLAYING}`,
  })
  @SubscribeMessage(SocketKeys.STREAM_GET_CURRENT_PLAYING)
  onGetCurrentPlaying(
    @MessageBody() data: GetCurrentPlayingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.getCurrentPlaying(data, socket);
  }

  @AsyncApiPub({
    channel: SocketKeys.STREAM_CB_CURRENT_PLAYING,
    message: {
      name: SocketKeys.STREAM_CB_CURRENT_PLAYING,
      payload: { type: StreamNowPlayingDto },
    },
    summary: `Send the current playing stream to the specified target`,
  })
  @SubscribeMessage(SocketKeys.STREAM_CB_CURRENT_PLAYING)
  onStreamCbCurrentPlaying(
    @MessageBody() data: StreamNowPlayingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.cbCurrentPlaying(data, socket);
  }

  @AsyncApiPub({
    channel: SocketKeys.STREAM_PLAY,
    message: {
      name: SocketKeys.STREAM_PLAY,
      payload: { type: StreamPlayDto },
    },
    tags: [{ name: 'stream' }],
  })
  @SubscribeMessage(SocketKeys.STREAM_PLAY)
  onStreamPlay(
    @MessageBody() data: StreamPlayDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.play(data, socket, this.movieRepository);
  }

  @AsyncApiPub({
    channel: SocketKeys.STREAM_TOGGLE_PLAY,
    message: {
      name: SocketKeys.STREAM_TOGGLE_PLAY,
      payload: { type: StreamTogglePlay },
    },
    tags: [{ name: 'stream' }],
  })
  @SubscribeMessage(SocketKeys.STREAM_TOGGLE_PLAY)
  onTogglePlay(
    @MessageBody() data: StreamTogglePlay,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.onTogglePlay(data, socket);
  }

  @AsyncApiPub({
    channel: SocketKeys.STREAM_SEEK,
    message: {
      name: SocketKeys.STREAM_SEEK,
      payload: { type: StreamTogglePlay },
    },
    tags: [{ name: 'stream' }],
  })
  @SubscribeMessage(SocketKeys.STREAM_SEEK)
  onSeek(
    @MessageBody() data: StreamTogglePlay,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.streamEventService.seek(data as any, socket);
  }

  @AsyncApiPub({
    channel: SocketKeys.FETCH_ONLINE_MEMBERS,
    message: {
      name: SocketKeys.FETCH_ONLINE_MEMBERS,
      payload: { type: PickType<UpdateMemberStatusPayload, 'roomId'> },
    },
    summary: 'fetch online members',
    tags: [{ name: 'Member' }],
  })
  @SubscribeMessage(SocketKeys.FETCH_ONLINE_MEMBERS)
  onFetchMembersStatus(
    @MessageBody() data: Pick<UpdateMemberStatusPayload, 'roomId'>,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.fetchOnlineMembers(data.roomId.toString(), socket);
  }
}
