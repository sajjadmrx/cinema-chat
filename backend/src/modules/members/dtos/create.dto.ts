import { ApiProperty } from '@nestjs/swagger';
import { Prisma, MemberPermissions } from '@prisma/client';
import { IsNumber, IsOptional } from 'class-validator';
import { MemberCreateInput } from 'src/shared/interfaces/member.interface';

export class MemberCreateDto {
  @ApiProperty({
    type: Number,
    required: false,
    example: 253696778,
  })
  @IsOptional()
  @IsNumber()
  inviteId?: number | null;
}
