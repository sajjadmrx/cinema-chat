import { Injectable, Logger } from "@nestjs/common";
import { Room } from "src/shared/interfaces/room.interface";
import { User } from "src/shared/interfaces/user.interface";
import { RoomCreateDto } from "./dto/create.dto";
import { RoomsRepository } from "./rooms.repository";
import { RoomUpdateDto } from "./dto/update.dto";
import { ResponseMessages } from "src/shared/constants/response-messages.constant";
import { MembersRepository } from "../members/members.repository";
import { MemberPermission } from "../../shared/interfaces/member.interface";

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(private roomsRepository: RoomsRepository, private membersRepository: MembersRepository) {
  }

  async create(input: RoomCreateDto, user: User): Promise<any> {
    try {
      const newRoom: Room = await this.roomsRepository.insert({
        name: input.name,
        ownerId: user.userId,
        isPublic: input.isPublic,
        avatar: input.avatar
      });
      await this.membersRepository.create({
        roomId: newRoom.roomId,
        userId: user.userId,
        inviteId: null,
        permissions: [MemberPermission.ADMINISTRATOR]
      });
      return { roomId: newRoom.roomId };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async update(roomId: number, userId: number, data: RoomUpdateDto) {
    try {
      await this.roomsRepository.updateById(roomId, {
        name: data.name,
        avatar: data.avatar,
        isPublic: data.isPublic
      });
      return ResponseMessages.SUCCESS;
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async getUserRooms(userId: number, page: number, limit: number): Promise<Room[]> {
    const maxLimit: number = 10;
    if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
      page = 1;
      limit = maxLimit;
    }
    if (limit > maxLimit) limit = maxLimit;
    return this.roomsRepository.getUserRooms(userId, page, limit);
  }

  async getPublicRooms(page: number, limit: number): Promise<Room[]> {
    const maxLimit: number = 10;
    if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
      page = 1;
      limit = maxLimit;
    }
    if (limit > maxLimit) limit = maxLimit;
    return this.roomsRepository.getPublicRooms(page, limit);
  }

}
