import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { getRandomNumber } from '../../src/shared/utils/uuid.util';

export async function createUserFixture(
  prismaService: PrismaService,
): Promise<User> {
  const pass = await bcrypt.hash('hashedPassword', 10);
  let username = getRandomNumber(15).toString();
  return prismaService.user.create({
    data: {
      userId: Date.now(),
      username: username,
      email: `${username}@gmail.com`,
      password: pass,
    },
  });
}
