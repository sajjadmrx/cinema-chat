import { UsersRepository } from "../users/users.repository";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dtos/signup.dto";
import { User } from "../../shared/interfaces/user.interface";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { SignInDto } from "./dtos/signin.dto";
import { ResponseMessages } from "../../shared/constants/response-messages.constant";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {
  }

  async signUp(input: SignUpDto): Promise<string> {
    try {
      const usersExists: User[] =
        await this.usersRepository.findByEmailOrUsername(
          input.email,
          input.username
        );
      if (usersExists.length)
        throw new BadRequestException(ResponseMessages.USER_EXISTS);

      input.password = await bcrypt.hash(input.password, 12);

      const createdUser = await this.usersRepository.insert(input);

      return this.jwtSignUserId(createdUser.userId);
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async login(input: SignInDto): Promise<string> {
    try {
      let user: User | null = await this.usersRepository.getByUsername(
        input.username
      );
      if (user) {
        const validPass = await bcrypt.compare(input.password, user.password);
        if (!validPass)
          throw new BadRequestException(
            ResponseMessages.INVALID_USERNAME_PASSWORD
          );

        return this.jwtSignUserId(user.userId);
      }
      throw new BadRequestException(ResponseMessages.INVALID_USERNAME_PASSWORD);
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
