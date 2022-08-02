import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Room, RoomCreateInput } from 'src/shared/interfaces/room.interface';
import { User } from 'src/shared/interfaces/user.interface';
import { RoomCreateDto } from './dto/create.dto';
import { RoomsRepository } from './rooms.repository';
import { RoomUpdateDto } from './dto/update.dto';
import { ResponseMessages } from 'src/shared/constants/response-messages.constant';

@Injectable()
export class RoomsService {
  constructor(private roomsRepository: RoomsRepository) {}

  async create(input: RoomCreateDto, user: User): Promise<any> {
    try {
      const newRoom: Room = await this.roomsRepository.insert({
        name: input.name,
        ownerId: user.userId,
        isPublic: input.isPublic,
        avatar: input.avatar,
      });
      return { roomId: newRoom.roomId };
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(roomId: number, userId: number, data: RoomUpdateDto) {
    try {
      await this.roomsRepository.updateById(roomId, {
        name: data.name,
        avatar: data.avatar,
        isPublic: data.isPublic,
      });
      return ResponseMessages.SUCCESS;
    } catch (error: any) {
      throw new InternalServerErrorException();
    }
  }
}
