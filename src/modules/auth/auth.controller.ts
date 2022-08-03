import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';

@ApiTags('Auth')
@UseInterceptors(ResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'signup',
    description: 'create User And get Jwt Token',
  })
  @Post('signup')
  async signup(@Body() data: SignUpDto): Promise<any> {
    return this.authService.signUp(data);
  }

  @ApiOperation({
    summary: 'signin',
    description: 'get Jwt Token',
  })
  @Post('signin')
  async signin(@Body() data: SignInDto) {
    return this.authService.signin(data);
  }
}
