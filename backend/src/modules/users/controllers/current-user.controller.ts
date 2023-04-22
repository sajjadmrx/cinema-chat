import {
  Controller,
  Get,
  HttpStatus,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Request, Response } from 'express';
import { getUser } from '../../../shared/decorators/user.decorator';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from '../../../shared/interceptors/response.interceptor';
import { ResponseFormat } from '../../../shared/interfaces/response.interface';
import { ApiGetMe } from '../docs/getMe.doc';
import { HttpExceptionFilter } from '../../../shared/filters/httpException.filter';

@ApiBearerAuth()
@ApiTags('Current User')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('users/@me')
export class CurrentUserController {
  constructor(private usersService: UsersService) {}

  @ApiGetMe()
  @Get('/')
  getMe(@getUser() user: User): ResponseFormat<Omit<User, 'password'>> {
    delete user.password;
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }
}
