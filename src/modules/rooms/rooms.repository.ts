import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsRepository {
  constructor(private prismaService: PrismaService) {}
}
