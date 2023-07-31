import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import { ResponseInterceptor } from '../../../shared/interceptors/response.interceptor';
import { ApiSignup } from './decorators/signup.doc';
import { ApiLogin } from './decorators/login.decorator';
import { HttpExceptionFilter } from '../../../shared/filters/httpException.filter';

@ApiTags('Auth')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiSignup()
  async signup(@Body() data: SignUpDto) {
    return this.authService.signUp(data);
  }

  @ApiLogin()
  async login(@Body() data: SignInDto) {
    return this.authService.login(data);
  }
}
