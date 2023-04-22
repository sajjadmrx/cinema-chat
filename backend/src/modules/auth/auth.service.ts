import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dtos/signup.dto';
import { User } from '../../shared/interfaces/user.interface';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dtos/signin.dto';
import { ResponseMessages } from '../../shared/constants/response-messages.constant';
import { ResponseFormat } from '../../shared/interfaces/response.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(input: SignUpDto): Promise<ResponseFormat<string>> {
    try {
      const usersExists: User[] =
        await this.usersRepository.findByEmailOrUsername(
          input.email,
          input.username,
        );
      if (usersExists.length)
        throw new BadRequestException(ResponseMessages.USER_EXISTS);

      input.password = await bcrypt.hash(input.password, 12);

      const createdUser = await this.usersRepository.insert(input);

      return {
        statusCode: 201,
        data: this.jwtSignUserId(createdUser.userId),
      };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async login(input: SignInDto): Promise<ResponseFormat<string>> {
    try {
      let user: User | null = await this.usersRepository.getByUsername(
        input.username,
      );
      if (user) {
        const validPass = await bcrypt.compare(input.password, user.password);
        if (!validPass)
          throw new UnauthorizedException(
            ResponseMessages.INVALID_USERNAME_PASSWORD,
          );

        const token = this.jwtSignUserId(user.userId);
        return {
          statusCode: 200,
          data: token,
        };
      }
      throw new UnauthorizedException(
        ResponseMessages.INVALID_USERNAME_PASSWORD,
      );
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  private jwtSignUserId(userId: number): string {
    return this.jwtService.sign({ userId });
  }

  jwtVerify(token: string) {
    return this.jwtService.verify(token);
  }
}
