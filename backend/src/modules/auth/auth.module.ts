import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstant } from '../../shared/constants/jwt.constant';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategists/jwt.strategy';

const importsAndExport = [
  JwtModule.register({
    secret: JwtConstant.SECRET,
    signOptions: JwtConstant.signOptions,
  }),
];

@Module({
  imports: [...importsAndExport, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [...importsAndExport, AuthService],
})
export class AuthModule {}
