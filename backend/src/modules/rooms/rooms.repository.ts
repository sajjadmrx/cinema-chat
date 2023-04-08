import { Injectable } from '@nestjs/common';
import {
  Room,
  RoomCreateInput,
  RoomUpdateInput,
} from 'src/shared/interfaces/room.interface';
import { getRandomNumber } from 'src/shared/utils/uuid.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsRepository {
  constructor(private db: PrismaService) {}

  async insert(input: RoomCreateInput): Promise<Room> {
    return this.db.room.create({
      data: {
        ...input,
        roomId: getRandomNumber(8),
      },
    });
  }

  async getById(id: number): Promise<Room | null> {
    return this.db.room.findUnique({
      where: {
        roomId: id,
      },
    });
  }

  async getUserRooms(userId: number, page: number, limit: number) {
    return this.db.room.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async getPublicRooms(page: number, limit: number) {
    return this.db.room.findMany({
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async updateById(id: number, input: RoomUpdateInput): Promise<Room> {
    return this.db.room.update({
      where: {
        roomId: id,
      },
      data: input,
    });
  }
}
