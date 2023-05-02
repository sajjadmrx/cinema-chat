import { Gateway } from '../gateway';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import { Member } from '../../../shared/interfaces/member.interface';
import { AsyncApiService } from 'nestjs-asyncapi';
import { Message } from '../../../shared/interfaces/message.interface';
import { MemberStatusConstant } from '../../../shared/constants/member.constant';
import { forwardRef, Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  WsEmitCallbackFetchOnlineMembers,
  WsEmitCreatedMessage,
  WsEmitDeletedMessage,
  WsEmitJoinMember,
  WsEmitKickedMember,
  WsEmitLaveMember,
  WsEmitUpdatedMember,
  WsEmitUpdatedMemberStatus,
  WsEmitUpdatedMessage,
} from '../docs/chat-emits.doc';

@AsyncApiService()
export class ChatEmit {
  constructor(
    @Inject(forwardRef(() => Gateway)) private chatGateway: Gateway,
  ) {}

  @WsEmitJoinMember()
  newMember(roomId: number, member: Member) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.NEW_MEMBER, { roomId, member });
  }

  @WsEmitLaveMember()
  laveMember(roomId: number, member: Member) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.LAVE, { roomId, member });
  }

  @WsEmitKickedMember()
  kickMember(roomId: number, member: Member, requesterId: number) {
    this.chatGateway.server.to(roomId.toString()).emit(SocketKeys.KICK_MEMBER, {
      roomId: roomId,
      member: member,
      by: requesterId,
    });
  }

  @WsEmitUpdatedMember()
  updateMember(
    roomId: string,
    member: Member,
    requesterId: number,
    newData: any,
  ) {
    this.chatGateway.server.to(roomId).emit(SocketKeys.UPDATE_MEMBER, {
      data: newData,
      roomId: roomId,
      memberId: member.userId,
      by: requesterId,
    });
  }

  @WsEmitCreatedMessage()
  createMessage(message: Message) {
    this.chatGateway.server
      .to(message.roomId.toString())
      .emit(SocketKeys.CREATE_MESSAGE, message);
  }

  @WsEmitUpdatedMessage()
  updateMessage(roomId: number, oldMessage: Message, newMessage: Message) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.UPDATE_MESSAGE, {
        roomId: roomId,
        oldMessage,
        newMessage,
      });
  }

  @WsEmitDeletedMessage()
  deleteMessage(roomId: number, memberId: number, messageId: number) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.DELETE_MESSAGE, {
        roomId,
        messageId,
        byId: memberId,
      });
  }

  @WsEmitUpdatedMemberStatus()
  updateMemberStatus(
    roomId: number,
    memberId: number,
    status: MemberStatusConstant,
  ) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.UPDATE_MEMBER_STATUS, {
        roomId,
        memberId,
        status,
      });
  }

  @WsEmitCallbackFetchOnlineMembers()
  callbackFetchOnlineMembers(socket: Socket, membersId: Array<number>): void {
    socket.emit(SocketKeys.FETCH_ONLINE_MEMBERS, membersId);
  }
}
