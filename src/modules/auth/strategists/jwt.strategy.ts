import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConstant } from '../../../shared/constants/jwt.constant';
import { User } from '../../../shared/interfaces/user.interface';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtConstant.SECRET,
    });
  }

  async validate(payload: any): Promise<User> {
    const user: User | null = await this.usersRepository.getById(payload.id);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
