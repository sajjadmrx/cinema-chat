import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Room } from 'src/shared/interfaces/room.interface';
import { User } from 'src/shared/interfaces/user.interface';
import { RoomCreateDto } from './dto/create.dto';
import { RoomsRepository } from './rooms.repository';
import { RoomUpdateDto } from './dto/update.dto';
import { ResponseMessages } from 'src/shared/constants/response-messages.constant';
import { MemberPermission } from '../../../shared/interfaces/member.interface';
import { MembersRepository } from '../members/repositories/members.repository';
import { ResponseFormat } from '../../../shared/interfaces/response.interface';

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  constructor(
    private roomsRepository: RoomsRepository,
    private membersRepository: MembersRepository,
  ) {}

  async create(input: RoomCreateDto, user: User): Promise<any> {
    try {
      const newRoom: Room = await this.roomsRepository.insert({
        name: input.name,
        ownerId: user.userId,
        isPublic: input.isPublic,
        avatar: input.avatar,
      });
      await this.membersRepository.create({
        roomId: newRoom.roomId,
        userId: user.userId,
        inviteId: null,
        permissions: [MemberPermission.ADMINISTRATOR],
      });
      return { roomId: newRoom.roomId };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async update(
    roomId: number,
    userId: number,
    data: RoomUpdateDto,
  ): Promise<ResponseFormat<string>> {
    try {
      await this.roomsRepository.updateById(roomId, {
        name: data.name,
        avatar: data.avatar,
        isPublic: data.isPublic,
      });
      return {
        statusCode: HttpStatus.OK,
        data: ResponseMessages.SUCCESS,
      };
    } catch (error: any) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async getUserRooms(
    userId: number,
    page: number,
    limit: number,
  ): Promise<ResponseFormat<any>> {
    const maxLimit = 10;
    if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
      page = 1;
      limit = maxLimit;
    }
    if (limit > maxLimit) limit = maxLimit;
    const rooms = await this.roomsRepository.getUserRooms(userId, page, limit);

    const totalRooms: number = await this.roomsRepository.getUserRoomsCount(
      userId,
    );
    const totalPages = Math.ceil(totalRooms / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      statusCode: HttpStatus.OK,
      data: {
        totalDoc: totalRooms,
        totalPages,
        nextPage,
        rooms,
      },
    };
  }

  async getPublicRooms(
    page: number,
    limit: number,
  ): Promise<ResponseFormat<any>> {
    const maxLimit = 10;
    if (!page || !limit || Number(page) < 1 || Number(limit) < 1) {
      page = 1;
      limit = maxLimit;
    }
    if (limit > maxLimit) limit = maxLimit;
    const rooms = await this.roomsRepository.getPublicRooms(page, limit);

    const totalRooms = await this.roomsRepository.getTotalPublicRooms();
    const totalPages = Math.ceil(totalRooms / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      statusCode: HttpStatus.OK,
      data: {
        totalDoc: totalRooms,
        totalPages,
        nextPage,
        rooms,
      },
    };
  }
}
