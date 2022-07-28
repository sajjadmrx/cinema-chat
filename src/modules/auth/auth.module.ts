import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstant } from '../../shared/constants/jwt.constant';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const importsAndExport = [
  JwtModule.register({
    secret: JwtConstant.SECRET,
    signOptions: JwtConstant.signOptions,
  }),
];

@Module({
  imports: [...importsAndExport],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [...importsAndExport],
})
export class AuthModule {}
