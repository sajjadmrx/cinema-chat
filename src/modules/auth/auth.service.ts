import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/signup.dto';
import { User } from '../../shared/interfaces/user.interface';
import { BadRequestException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(input: SignUpDto): Promise<string> {
    try {
      const userExists: User | null =
        await this.usersRepository.findByEmailOrUsername(
          input.email,
          input.username,
        );
      if (userExists) throw new BadRequestException('USER_EXISTS');

      input.password = await bcrypt.hash(input.password, 12);

      const createdUser = await this.usersRepository.insert(input);

      return this.jwtSignUserId(createdUser.userId);
    } catch (e) {}
  }

  private jwtSignUserId(userId: number): string {
    return this.jwtService.sign({ userId });
  }
}
