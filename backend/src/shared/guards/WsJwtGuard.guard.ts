import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../../modules/auth/auth.service';
import { UsersRepository } from '../../modules/users/users.repository';
import { User } from '../interfaces/user.interface';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuardGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authorization: string | null =
        client.handshake.headers['authorization'];
      if (!authorization) throw new UnauthorizedException();
      let token: string | null = authorization.split(' ')[1];
      if (!token) throw new UnauthorizedException();

      const result = this.authService.jwtVerify(token);
      // const user: User | null = await this.userRepository.getById(
      //   result.userId,
      // );
      if (!result.userId) throw new UnauthorizedException();
      //   context.switchToWs().getData().userId = result.userId;
      return true;
    } catch (e) {
      throw e;
    }
  }
}
