import { Body, Controller, Param, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { InvitesService } from "./invites.service";
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';
import { InviteCreateDto } from './dtos/create.dto';
import { getUser } from "src/shared/decorators/user.decorator";


@ApiTags('Invites')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ResponseInterceptor)
@Controller('invites')
export class InvitesController {
    constructor(private invitesService: InvitesService) { }

    @ApiResponse({
        status: 201,
        schema: {
            example: {
                "statusCode": 201,
                "data": "xw161ca1fa"
            }
        }
    })
    @ApiResponse({
        status: 400,
        schema: {
            example: {
                statusCode: 400,
                message: "ROOM_NOT_FOUND"
            }
        }
    })
    @Post()
    async create(@Body() data: InviteCreateDto, @getUser('userId') userId: number) {
        return this.invitesService.create(data, userId)
    }
}