import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { RoomsRepository } from "src/modules/rooms/rooms.repository";

@Injectable()
export class CheckRoomId implements CanActivate {
    constructor(private roomsRepository: RoomsRepository) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request: Request = context.switchToHttp().getRequest<Request>();
            const roomId: number = Number(request.params.roomId)
            if (!roomId)
                throw new Error();

            const room = await this.roomsRepository.getById(roomId);
            if (!room)
                throw new Error();

            //TODO: Add To Request | Ex: request.currentRoom
            return true
        } catch (error) {
            throw new BadRequestException("ROOM_NOT_FOUND")
        }
    }
}