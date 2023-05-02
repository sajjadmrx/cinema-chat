import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../../shared/interfaces/member.interface';
import { MemberStatusConstant } from '../../../shared/constants/member.constant';

export class JoinMemberPayload {
  @ApiProperty({})
  readonly member: Member;

  @ApiProperty({})
  readonly roomId: number;
}

export class LaveMemberPayload extends JoinMemberPayload {}

export class KickMemberPayload extends JoinMemberPayload {
  @ApiProperty()
  readonly by: number;
}

export class UpdateMemberPayload {
  @ApiProperty()
  readonly roomId: number;
  @ApiProperty()
  readonly data: any;
  @ApiProperty()
  readonly memberId: number;
  @ApiProperty()
  readonly by: number;
}

export class UpdateMemberStatusPayload {
  @ApiProperty()
  readonly roomId: number;
  @ApiProperty()
  readonly memberId: number;

  @ApiProperty({
    enum: MemberStatusConstant,
  })
  readonly status: MemberStatusConstant;
}

export class FetchOnlineMembersPayload {
  @ApiProperty({})
  readonly roomId: number;
}
