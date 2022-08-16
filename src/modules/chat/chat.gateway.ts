import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
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
import { AuthGuard } from '@nestjs/passport';
import { WsJwtGuardGuard } from '../../shared/guards/WsJwtGuard.guard';
import { WebsocketExceptionsFilter } from '../../shared/filters/WebsocketExceptions.filter';
import { User } from '../../shared/interfaces/user.interface';
import { Client } from 'socket.io/dist/client';
import { AuthService } from '../auth/auth.service';
import { UsersRepository } from '../users/users.repository';
import { Room } from '../../shared/interfaces/room.interface';

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
    private readonly messagesService: ChatService,
    private authService: AuthService,
    private usersRepository: UsersRepository,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authorization: string | null =
        client.handshake.headers['authorization'];
      if (!authorization) throw new UnauthorizedException();
      let token: string | null = authorization.split(' ')[1];
      const result = this.authService.jwtVerify(token);
      const userId = result.userId;
      const user = await this.usersRepository.getAndRoomsById(userId);
      user.Rooms.map((r) => client.join(r.roomId.toString()));
      if (!user) throw new Error();

      delete user.password;
      client.data.user = user;
    } catch (e) {
      this.disconnect(client);
    }
    // this.onlineUsers.set(userId, client.id);
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`IOClient disconnected: ${client.id}`);
  }

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }
}
