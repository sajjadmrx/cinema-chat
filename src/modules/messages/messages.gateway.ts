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
import { MessagesService } from './messages.service';
import { Injectable, Logger, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsJwtGuardGuard } from '../../shared/guards/WsJwtGuard.guard';
import { WebsocketExceptionsFilter } from '../../shared/filters/WebsocketExceptions.filter';
import { User } from '../../shared/interfaces/user.interface';

@UseGuards(WsJwtGuardGuard)
@UseFilters(WebsocketExceptionsFilter)
@WebSocketGateway(81, {
  transports: ['websocket'],
  namespace: 'messages',
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger(MessagesGateway.name);
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Connected : ${client.id}`);
  }

  handleDisconnect(client: Socket): any {
    this.logger.log(`IOClient disconnected: ${client.id}`);
  }

  @SubscribeMessage('send')
  handleEvent(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {}
}
