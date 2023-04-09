import { ChatGateway } from './chat.gateway';
import { SocketKeys } from '../../shared/constants/socket.keys';
import { Member } from '../../shared/interfaces/member.interface';
import { AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi';
import {
  JoinMemberExa,
  KickMemberExa,
  LaveMemberExa,
  UpdateMemberExa,
  UpdateMemberStatusExa,
} from '../../shared/examples/socket/member.example';
import { Message } from '../../shared/interfaces/message.interface';
import { MessageCreateDto } from '../messages/dtos/creates.dto';
import {
  MessageDeleteExa,
  MessageUpdateExa,
} from '../../shared/examples/socket/message.example';
import { MemberStatusConstant } from '../../shared/constants/member.constant';
import { forwardRef, Inject } from '@nestjs/common';

@AsyncApiService()
export class ChatEmits {
  constructor(
    @Inject(forwardRef(() => ChatGateway)) private chatGateway: ChatGateway,
  ) {}

  @AsyncApiSub({
    channel: SocketKeys.NEW_MEMBER,
    description: 'listen event Join a member',
    message: { name: 'member', payload: { type: JoinMemberExa } },
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
    message: { name: 'member', payload: { type: LaveMemberExa } },
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
    message: { name: 'member', payload: { type: KickMemberExa } },
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
    message: { name: 'member', payload: { type: UpdateMemberExa } },
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
    message: { name: 'message', payload: { type: MessageCreateDto } },
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
      payload: { type: MessageUpdateExa },
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
      payload: { type: MessageDeleteExa },
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
      payload: { type: UpdateMemberStatusExa },
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
