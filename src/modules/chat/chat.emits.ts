import { ChatGateway } from "./chat.gateway";
import { EmitKeysConstant } from "../../shared/constants/event-keys.constant";
import { Member } from "../../shared/interfaces/member.interface";
import { AsyncApiService, AsyncApiSub } from "nestjs-asyncapi";
import {
  JoinMemberExa,
  KickMemberExa,
  LaveMemberExa,
  UpdateMemberExa
} from "../../shared/examples/socket/member.example";


@AsyncApiService()
export class ChatEmits {
  constructor(private chatGateway: ChatGateway) {
  }


  @AsyncApiSub({
    channel: EmitKeysConstant.NEW_MEMBER,
    description: "listen event Join a member",
    message: { name: "member", payload: { type: JoinMemberExa } },
    tags: [{ name: "member", description: "member a room" }]
  })
  newMember(roomId: string, member: Member) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(EmitKeysConstant.NEW_MEMBER, member);
  }

  @AsyncApiSub({
    channel: EmitKeysConstant.LAVE,
    description: "listen event Lave a member",
    message: { name: "member", payload: { type: LaveMemberExa } },
    tags: [{ name: "member", description: "member a room" }]
  })
  laveMember(roomId: string, member: Member) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(EmitKeysConstant.LAVE, member);
  }

  @AsyncApiSub({
    channel: EmitKeysConstant.KICK_MEMBER,
    description: "listen event Kick a Member",
    message: { name: "member", payload: { type: KickMemberExa } },
    tags: [{ name: "member", description: "member a room" }]
  })
  kickMember(roomId: string, member: Member, requesterId: number) {
    this.chatGateway.server
      .to(roomId.toString())
      .emit(EmitKeysConstant.KICK_MEMBER, {
        member: member,
        by: requesterId
      });

  }


  @AsyncApiSub({
    channel: EmitKeysConstant.UPDATE_MEMBER,
    description: "listen event update a Member",
    message: { name: "member", payload: { type: UpdateMemberExa } },
    tags: [{ name: "member", description: "member a room" }]
  })
  updateMember(roomId: string, member: Member, requesterId: number, newData: any) {
    this.chatGateway.server
      .to(roomId)
      .emit(EmitKeysConstant.UPDATE_MEMBER, {
        data: newData,
        memberId: member.userId,
        by: requesterId
      });
  }
}