import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/signup.dto';
import { User } from '../../shared/interfaces/user.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(input: SignUpDto): Promise<string> {
    try {
      const usersExists: User[] =
        await this.usersRepository.findByEmailOrUsername(
          input.email,
          input.username,
        );
      if (usersExists.length) throw new BadRequestException('USER_EXISTS');

      input.password = await bcrypt.hash(input.password, 12);

      const createdUser = await this.usersRepository.insert(input);

      return this.jwtSignUserId(createdUser.userId);
    } catch (e) {
      throw e;
    }
  }

  async signin(input: SignInDto): Promise<string> {
    try {
      let user: User | null = await this.usersRepository.getByUsername(
        input.username,
      );
      if (user) {
        const validPass = await bcrypt.compare(input.password, user.password);
        if (!validPass)
          throw new BadRequestException('INVALID_USERNAME_PASSWORD');

        return this.jwtSignUserId(user.userId);
      }
      throw new BadRequestException('INVALID_USERNAME_PASSWORD');
    } catch (e) {
      throw e;
    }
  }

  private jwtSignUserId(userId: number): string {
    return this.jwtService.sign({ userId });
  }
}
