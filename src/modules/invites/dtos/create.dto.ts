import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDate, IsDateString, IsNumber } from "class-validator"

export class InviteCreateDto {
    @ApiProperty({
        description: 'Expire after',
        required: true,
        type: Date
    })
    @IsDateString()
    expires_at: Date

    @ApiProperty({
        description: 'never Expire',
        required: true,
        type: Boolean
    })
    @IsBoolean()
    isForEver: boolean

    @ApiProperty({
        description: 'Max Number Of Uses',
        required: true,
        example: 0//no limit
    })
    @IsNumber()
    max_use: number

    @ApiProperty({
        description: 'room Id',
        required: true,
    })
    @IsNumber()
    roomId: number

}