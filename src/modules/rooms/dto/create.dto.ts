import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RoomCreateInput } from "src/shared/interfaces/room.interface";

export class RoomCreateDto {

    @ApiProperty({
        description: 'room name',
        required: true,
        type: String,
        default: 'relaxing'
    })
    @IsString()
    @IsNotEmpty()
    name: string


    @ApiProperty({
        description: 'Room access status',
        required: true,
        type: Boolean,
        default: false
    })
    @IsBoolean()
    isPublic: boolean;


    @ApiProperty({
        description: 'Room profile',
        required: false,
        type: Boolean,
        default: "DEFAULT_AVATAR"
    })
    @IsString()
    @IsOptional()
    avatar?: string;

}