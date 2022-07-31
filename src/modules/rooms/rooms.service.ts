import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Room, RoomCreateInput } from "src/shared/interfaces/room.interface";
import { User } from "src/shared/interfaces/user.interface";
import { RoomCreateDto } from "./dto/create.dto";
import { RoomsRepository } from './rooms.repository';

@Injectable()
export class RoomsService {
    constructor(private roomsRepository: RoomsRepository) { }


    async create(input: RoomCreateDto, user: User): Promise<any> {
        try {
            const newRoom: Room = await this.roomsRepository.insert({ name: input.name, ownerId: user.userId, isPublic: input.isPublic, avatar: input.avatar })
            return { roomId: newRoom.roomId }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}