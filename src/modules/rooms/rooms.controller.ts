import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { RoomCreateDto } from './dto/create.dto';
import { getUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/shared/interfaces/user.interface';
import { ResponseInterceptor } from 'src/shared/interceptors/response.interceptor';


@UseInterceptors(ResponseInterceptor)
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) { }


  @Get()
  async getRooms() {
    return []
  }


  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      example: { statusCode: 201, data: { roomId: 57635829 } }
    }
  })
  @ApiResponse({
    status: 500,
    schema: {
      example: {
        statusCode: 500,
        message: "Internal Server Error"
      }
    }
  })
  @UseGuards(AuthGuard("jwt"))
  @Post()
  async create(@Body() data: RoomCreateDto, @getUser() user: User) {
    return this.roomsService.create(data, user)
  }
}
