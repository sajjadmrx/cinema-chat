import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';
import { ApiSignup } from './docs/signup.doc';
import { ApiLogin } from './docs/login.doc';

@ApiTags('Auth')
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiSignup()
  @Post('signup')
  async signup(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @ApiLogin()
  @Post('login')
  async login(@Body() data: SignInDto) {
    return this.authService.login(data);
  }
}
