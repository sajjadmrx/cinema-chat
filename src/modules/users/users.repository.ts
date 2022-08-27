import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  User,
  UserCraeteInput,
  UserWithRooms
} from "../../shared/interfaces/user.interface";
import { getRandomNumber } from "../../shared/utils/uuid.util";
import { Member } from "../../shared/interfaces/member.interface";
import { Room } from "../../shared/interfaces/room.interface";

@Injectable()
export class UsersRepository {
  constructor(private db: PrismaService) {
  }

  async findAll(): Promise<Array<User>> {
    return this.db.user.findMany();
  }

  async insert(input: Omit<UserCraeteInput, "userId">): Promise<User> {
    return this.db.user.create({
      data: {
        userId: getRandomNumber(12),
        ...input
      }
    });
  }

  async getById(userId: number): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        userId
      }
    });
  }

  async getAndRoomsById(userId: number): Promise<User> {
    return this.db.user.findFirst({
      where: { userId }
    });
  }

  async getByUsername(username: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: {
        username
      }
    });
  }

  findByEmailOrUsername(email: string, username: string): Promise<User[]> {
    return this.db.user.findMany({
      where: {
        OR: [
          {
            email
          },
          { username }
        ]
      }
    });
  }
}
