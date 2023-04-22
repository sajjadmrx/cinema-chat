import { ApiProperty } from '@nestjs/swagger';
import { Contains, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'The username of the user',
    required: true,
    type: String,
    example: 'sajjadmrx',
    uniqueItems: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
    type: String,
    example: 'fake@gmail.com',
    uniqueItems: true,
  })
  @Contains('@gmail', {
    message: 'Email must be a gmail account',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    /// Password
    description: 'The password of the user',
    required: true,
    type: String,
    example: '@armiow2516fds',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
