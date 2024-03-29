import { ApiProperty } from '@nestjs/swagger';
import {
  MemberPermission,
  MemberPermissionType,
} from '../../../shared/interfaces/member.interface';
import {
  ArrayContains,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export class UpdateCurrentMemberDto {
  @ApiProperty({
    type: String,
    example: 'test',
    required: false,
  })
  @IsString()
  @IsOptional()
  nickname: string;

  @ApiProperty({
    type: Array,
    required: true,
    isArray: true,
    example: [MemberPermission.DEFAULT],
    description: 'required Permission: ADMINISTRATOR, for update this field',
  })
  @ArrayContains([MemberPermission.DEFAULT])
  @ArrayNotEmpty()
  @IsArray({})
  permissions: Array<MemberPermissionType>;
}
