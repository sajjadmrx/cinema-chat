import { Gateway } from '../gateway';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import { Member } from '../../../shared/interfaces/member.interface';
import { AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi';
import {
  JoinMemberPayload,
  KickMemberPayload,
  LaveMemberPayload,
  UpdateMemberPayload,
  UpdateMemberStatusPayload,
} from '../payloads/member.payload';
import { Message } from '../../../shared/interfaces/message.interface';
import {
  MessageDeletePayload,
  MessagePayload,
  MessageUpdatePayload,
} from '../payloads/message.payload';
import { MemberStatusConstant } from '../../../shared/constants/member.constant';
import { forwardRef, Inject } from '@nestjs/common';

@AsyncApiService()
export class ChatEmit {
  constructor(
    @Inject(forwardRef(() => Gateway)) private chatGateway: Gateway,
  ) {}

  @AsyncApiSub({
    channel: SocketKeys.NEW_MEMBER,
    description: 'listen event Join a member',
    message: { name: 'member', payload: { type: JoinMemberPayload } },
    tags: [{ name: 'member', description: 'member a room' }],
  })
  newMember(roomId: number, member: Member) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.NEW_MEMBER, { roomId, member });
  }

  @AsyncApiSub({
    channel: SocketKeys.LAVE,
    description: 'listen event Lave a member',
    message: { name: 'member', payload: { type: LaveMemberPayload } },
    tags: [{ name: 'member', description: 'member a room' }],
  })
  laveMember(roomId: number, member: Member) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.LAVE, { roomId, member });
  }

  @AsyncApiSub({
    channel: SocketKeys.KICK_MEMBER,
    description: 'listen event Kick a Member',
    message: { name: 'member', payload: { type: KickMemberPayload } },
    tags: [{ name: 'member', description: 'member a room' }],
  })
  kickMember(roomId: number, member: Member, requesterId: number) {
    this.chatGateway.server.to(roomId.toString()).emit(SocketKeys.KICK_MEMBER, {
      roomId: roomId,
      member: member,
      by: requesterId,
    });
  }

  @AsyncApiSub({
    channel: SocketKeys.UPDATE_MEMBER,
    description: 'listen event update a Member',
    message: { name: 'member', payload: { type: UpdateMemberPayload } },
    tags: [{ name: 'member', description: 'member a room' }],
  })
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

  @AsyncApiSub({
    channel: SocketKeys.CREATE_MESSAGE,
    description: 'listen event create Message(send Message)',
    message: { name: 'message', payload: { type: MessagePayload } },
    tags: [{ name: 'message' }],
  })
  createMessage(message: Message) {
    this.chatGateway.server
      .to(message.roomId.toString())
      .emit(SocketKeys.CREATE_MESSAGE, message);
  }

  @AsyncApiSub({
    channel: SocketKeys.UPDATE_MESSAGE,
    description: 'listen event update Message ',
    message: {
      name: SocketKeys.UPDATE_MESSAGE,
      payload: { type: MessageUpdatePayload },
    },
    tags: [{ name: 'message' }],
  })
  updateMessage(roomId: number, oldMessage: Message, newMessage: Message) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.UPDATE_MESSAGE, {
        roomId: roomId,
        oldMessage,
        newMessage,
      });
  }

  @AsyncApiSub({
    channel: SocketKeys.DELETE_MESSAGE,
    tags: [{ name: 'message' }],
    description: 'listen for delete message',
    message: {
      name: SocketKeys.DELETE_MESSAGE,
      payload: { type: MessageDeletePayload },
    },
  })
  deleteMessage(roomId: number, memberId: number, messageId: number) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(SocketKeys.DELETE_MESSAGE, {
        roomId,
        messageId,
        byId: memberId,
      });
  }

  @AsyncApiSub({
    channel: SocketKeys.UPDATE_MEMBER_STATUS,
    tags: [{ name: 'Member' }],
    message: {
      name: SocketKeys.UPDATE_MEMBER_STATUS,
      payload: { type: UpdateMemberStatusPayload },
    },
    description: 'listen event Update Member Status',
  })
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
}
