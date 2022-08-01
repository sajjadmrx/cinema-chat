import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
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



    @ApiResponse({
        status: 200,
        description: "Find RoomId By Slug",
        schema: {
            example: {
                statusCode: 200,
                data: 64679854
            }
        }
    })
    @ApiResponse({
        status: 404,
        schema: {
            example: {
                statusCode: 404,
                message: "INVALID_INVITE"
            }
        }
    })
    @ApiParam({ name: 'slug', type: String })
    @Get(':slug')
    async findRoom(@Param('slug') slug: string) {
        return this.invitesService.findRoom(slug)
    }
}