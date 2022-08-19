import { Injectable } from "@nestjs/common";
import { MemberPermission } from "src/shared/interfaces/member.interface";
import {
  Room,
  RoomCreateInput,
  RoomUpdateInput
} from "src/shared/interfaces/room.interface";
import { getRandomNumber } from "src/shared/utils/uuid.util";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RoomsRepository {
  constructor(private db: PrismaService) {
  }

  async insert(input: RoomCreateInput): Promise<Room> {
    return this.db.room.create({
      data: {
        ...input,
        roomId: getRandomNumber(8),
        Members: {
          create: [
            {
              userId: input.ownerId,
              permissions: [MemberPermission.ADMINISTRATOR]
            }
          ]
        }
      }
    });
  }

  async getById(id: number): Promise<Room | null> {
    return this.db.room.findUnique({
      where: {
        roomId: id
      }
    });
  }

  async findByUserId(userId: number, page: number, limit: number): Promise<Room[]> {
    return this.db.room.findMany({
      where: {
        Members: { some: { userId } }
      },
      take: limit,
      skip: (page - 1) * limit
    });
  }

  async getRoomsIdByUserId(userId: number): Promise<Array<{ roomId: number }>> {
    return this.db.room.findMany({
      where: {
        Members: { some: { userId } }
      },
      select: {
        roomId: true
      }
    });
  }

  async updateById(id: number, input: RoomUpdateInput): Promise<Room> {
    return this.db.room.update({
      where: {
        roomId: id
      },
      data: input
    });
  }
}
