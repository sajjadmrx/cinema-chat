import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class KickDto {
  @ApiProperty({
    name: 'memberId',
    type: Number,
    required: true,
  })
  @IsNumber()
  memberId: number;
}