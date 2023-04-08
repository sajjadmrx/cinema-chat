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
import { WsJwtGuardGuard } from '../../shared/guards/WsJwtGuard.guard';
import { WebsocketExceptionsFilter } from '../../shared/filters/WebsocketExceptions.filter';
import { AsyncApiPub, AsyncApiService } from 'nestjs-asyncapi';
import { EventKeysConstant } from '../../shared/constants/event-keys.constant';
import { MessageCreateDto } from '../messages/dtos/creates.dto';
import { MessageUpdateDto } from '../messages/dtos/update.dto';
import { ChatEmits } from './chat.emits';
import { StreamNowPlayingDto, StreamPlayDto } from './dtos/stream.dto';
import { ConnectionService } from './services/connection.service';

@AsyncApiService()
@UsePipes(new ValidationPipe())
@UseGuards(WsJwtGuardGuard)
@UseFilters(WebsocketExceptionsFilter)
@WebSocketGateway(81, {
  transports: ['websocket'],
  cors: {
    origin: '*',
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  server: Server;
  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    @Inject(forwardRef(() => ChatEmits))
    private chatEmits: ChatEmits,
    private connectionService: ConnectionService,
  ) {}

  async handleConnection(client: Socket) {
    return this.connectionService.handleConnection(client);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    return this.connectionService.handleDisconnect(client);
  }

  @AsyncApiPub({
    channel: EventKeysConstant.CREATE_MESSAGE,
    message: { name: 'test', payload: { type: MessageCreateDto } },
    tags: [{ name: 'message', description: 'Messages on room' }],
    description: 'call event create Message',
  })
  @SubscribeMessage(EventKeysConstant.CREATE_MESSAGE)
  onCreateMessage(
    @MessageBody() data: MessageCreateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.sendMessageRoom(data, socket);
  }

  @AsyncApiPub({
    channel: EventKeysConstant.UPDATE_MESSAGE,
    message: { name: 'UPDATE_MESSAGE', payload: { type: MessageUpdateDto } },
    tags: [{ name: 'message' }],
  })
  @SubscribeMessage(EventKeysConstant.UPDATE_MESSAGE)
  onUpdateMessage(
    @MessageBody() data: MessageUpdateDto,
    @ConnectedSocket() socket: Socket,
  ) {
    return this.chatService.updateMessageRoom(data, socket);
  }

  @AsyncApiPub({
    channel: EventKeysConstant.STREAM_GET_CURRENT_PLAYING,
    message: {
      name: EventKeysConstant.STREAM_GET_CURRENT_PLAYING,
      payload: { type: StreamNowPlayingDto },
    },
    tags: [{ name: 'stream' }],
    summary: `Get the current stream with response in the event: ${EventKeysConstant.STREAM_FETCH_CURRENT_PLAYING}`,
  })
  @SubscribeMessage(EventKeysConstant.STREAM_GET_CURRENT_PLAYING)
  onStreamNowPlaying(
    @MessageBody() data: StreamNowPlayingDto,
    @ConnectedSocket() socket: Socket,
  ) {
    // send request to owner room for getting Current Play
    //add targetId to data object => socket.id
  }

  @AsyncApiPub({
    channel: EventKeysConstant.STREAM_FETCH_CURRENT_PLAYING,
    message: {
      name: EventKeysConstant.STREAM_FETCH_CURRENT_PLAYING,
      payload: { type: StreamNowPlayingDto },
    },
    summary: `Fetch the current playing stream and send it to the target`,
  })
  @SubscribeMessage(EventKeysConstant.STREAM_FETCH_CURRENT_PLAYING)
  onStreamFetchCurrentPlaying() {
    // callback owner
    // send current playing to target with data.target
  }

  @AsyncApiPub({
    channel: EventKeysConstant.STREAM_PLAY,
    message: {
      name: EventKeysConstant.STREAM_PLAY,
      payload: { type: StreamPlayDto },
    },
    tags: [{ name: 'stream' }],
  })
  @SubscribeMessage(EventKeysConstant.STREAM_PLAY)
  onStreamPlay(
    @MessageBody() data: StreamPlayDto,
    @ConnectedSocket() socket: Socket,
  ) {
    //send broadcast to room
  }
}
