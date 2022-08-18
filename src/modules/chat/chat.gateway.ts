import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { WsJwtGuardGuard } from '../../shared/guards/WsJwtGuard.guard';
import { WebsocketExceptionsFilter } from '../../shared/filters/WebsocketExceptions.filter';
import { AuthService } from '../auth/auth.service';
import { RoomsRepository } from '../rooms/rooms.repository';

@UseGuards(WsJwtGuardGuard)
@UseFilters(WebsocketExceptionsFilter)
@WebSocketGateway(81, {
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  server: Server;

  public onlineUsers = new Map();

  constructor(
    private authService: AuthService,
    private roomsRepository: RoomsRepository,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authorization: string | null =
        client.handshake.headers['authorization'];
      if (!authorization) throw new UnauthorizedException();
      let token: string | null = authorization.split(' ')[1];
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

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }
}
