import { applyDecorators } from '@nestjs/common';
import { AsyncApiSub } from 'nestjs-asyncapi';
import { SocketKeys } from '../../../shared/constants/socket.keys';
import {
  JoinMemberPayload,
  KickMemberPayload,
  LaveMemberPayload,
  UpdateMemberPayload,
  UpdateMemberStatusPayload,
} from '../payloads/member.payload';
import {
  MessageDeletePayload,
  MessagePayload,
  MessageUpdatePayload,
} from '../payloads/message.payload';
import { PickType } from '@nestjs/swagger';

export function WsEmitJoinMember() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.NEW_MEMBER,
      description: 'listen event Join a member',
      message: { name: 'member', payload: { type: JoinMemberPayload } },
      tags: [{ name: 'member', description: 'member a room' }],
    }),
  );
}

export function WsEmitLaveMember() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.LAVE,
      description: 'listen event Lave a member',
      message: { name: 'member', payload: { type: LaveMemberPayload } },
      tags: [{ name: 'member', description: 'member a room' }],
    }),
  );
}

export function WsEmitKickedMember() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.KICK_MEMBER,
      description: 'listen event Kick a Member',
      message: { name: 'member', payload: { type: KickMemberPayload } },
      tags: [{ name: 'member', description: 'member a room' }],
    }),
  );
}

export function WsEmitUpdatedMember() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.UPDATE_MEMBER,
      description: 'listen event update a Member',
      message: { name: 'member', payload: { type: UpdateMemberPayload } },
      tags: [{ name: 'member', description: 'member a room' }],
    }),
  );
}

export function WsEmitCreatedMessage() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.CREATE_MESSAGE,
      description: 'listen event create Message(send Message)',
      message: { name: 'message', payload: { type: MessagePayload } },
      tags: [{ name: 'message' }],
    }),
  );
}
export function WsEmitUpdatedMessage() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.UPDATE_MESSAGE,
      description: 'listen event update Message ',
      message: {
        name: SocketKeys.UPDATE_MESSAGE,
        payload: { type: MessageUpdatePayload },
      },
      tags: [{ name: 'message' }],
    }),
  );
}

export function WsEmitDeletedMessage() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.DELETE_MESSAGE,
      tags: [{ name: 'message' }],
      description: 'listen for delete message',
      message: {
        name: SocketKeys.DELETE_MESSAGE,
        payload: { type: MessageDeletePayload },
      },
    }),
  );
}

export function WsEmitUpdatedMemberStatus() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.UPDATE_MEMBER_STATUS,
      tags: [{ name: 'Member' }],
      message: {
        name: SocketKeys.UPDATE_MEMBER_STATUS,
        payload: { type: UpdateMemberStatusPayload },
      },
      description: 'listen event Update Member Status',
    }),
  );
}

export function WsEmitCallbackFetchOnlineMembers() {
  return applyDecorators(
    AsyncApiSub({
      channel: SocketKeys.FETCH_ONLINE_MEMBERS,
      tags: [{ name: 'Member' }],
      message: {
        name: SocketKeys.FETCH_ONLINE_MEMBERS,
        payload: { type: PickType<UpdateMemberStatusPayload, 'roomId'> },
      },
      description: 'callback Fetch online Members',
    }),
  );
}
