import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../../interfaces/member.interface';
import { MemberStatusConstant } from '../../constants/member.constant';

export class JoinMemberExa {
  @ApiProperty({})
  readonly member: Member;

  @ApiProperty({})
  readonly roomId: number;
}

export class LaveMemberExa extends JoinMemberExa {}

export class KickMemberExa extends JoinMemberExa {
  @ApiProperty()
  readonly by: number;
}

export class UpdateMemberExa {
  @ApiProperty()
  readonly roomId: number;
  @ApiProperty()
  readonly data: any;
  @ApiProperty()
  readonly memberId: number;
  @ApiProperty()
  readonly by: number;
}

export class UpdateMemberStatusExa {
  @ApiProperty()
  readonly roomId: 44117771;
  @ApiProperty()
  readonly memberId: number;

  @ApiProperty({
    enum: MemberStatusConstant,
    name: 'MemberStatus',
  })
  readonly status: 'OFFLINE';
}
