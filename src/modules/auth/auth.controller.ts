import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';

@UseInterceptors(ResponseInterceptor)
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignUpDto): Promise<any> {
    return this.authService.signUp(data);
  }

  @Post('signin')
  async signin(@Body() data: SignInDto) {
    return this.authService.signin(data);
  }
}
