import { ApiProperty } from "@nestjs/swagger";
import { Member } from "../../interfaces/member.interface";
import { MemberStatusConstant } from "../../constants/member.constant";

export class JoinMemberExa {
  @ApiProperty({})
  readonly member: Member;
}

export class LaveMemberExa extends JoinMemberExa {
}


export class KickMemberExa extends JoinMemberExa {
  @ApiProperty()
  readonly by: number;
}

export class UpdateMemberExa {
  @ApiProperty()
  data: any;
  @ApiProperty()
  memberId: number;

  @ApiProperty()
  by: number;

}

export class UpdateMemberStatusExa {
  @ApiProperty()
  roomId: 44117771;
  @ApiProperty()
  memberId: number;

  @ApiProperty({
    enum: MemberStatusConstant,
    name: "MemberStatus"
  })
  status: "OFFLINE";
}