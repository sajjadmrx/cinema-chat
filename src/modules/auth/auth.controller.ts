import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SignUpDto } from "./dtos/signup.dto";
import { SignInDto } from "./dtos/signin.dto";
import { ResponseInterceptor } from "../../shared/interceptors/response.interceptor";

@ApiTags("Auth")
@UseInterceptors(ResponseInterceptor)
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @ApiOperation({
    summary: "signup",
    description: "create User And get Jwt Token"
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        data: "tokenString-------"
      }
    }
  })
  @Post("signup")
  async signup(@Body() data: SignUpDto): Promise<string> {
    return this.authService.signUp(data);
  }

  @ApiOperation({
    summary: "login",
    description: "get Jwt Token"
  })
  @Post("login")
  async login(@Body() data: SignInDto): Promise<string> {
    return this.authService.login(data);
  }
}
