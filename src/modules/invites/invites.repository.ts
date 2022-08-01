import { Injectable } from '@nestjs/common';
import { Invite, InviteCreateInput, InviteWithRoom } from 'src/shared/interfaces/invite.interface';
import { PrismaService } from '../prisma/prisma.service';
import { getRandomNumber, getRandomString } from '../../shared/utils/uuid.util';
import { Room } from 'src/shared/interfaces/room.interface';

@Injectable()
export class InvitesRepository {
    constructor(private db: PrismaService) { }

    async create(input: InviteCreateInput): Promise<Invite> {
        return this.db.invite.create({
            data: {
                inviteId: getRandomNumber(9),
                expires_at: input.expires_at,
                max_use: input.max_use,
                slug: getRandomString(10),
                isForEver: input.isForEver,
                roomId: input.roomId,
                inviterId: input.inviterId,
            }
        })
    }

    async getBySlug(slug: string): Promise<InviteWithRoom | null> {
        return this.db.invite.findUnique({
            where: {
                slug
            },
            include: {
                room: true,
            },
        })

    }

    async getById(id: number): Promise<Invite | null> {
        return this.db.invite.findUnique({
            where: {
                inviteId: id
            }
        })
    }

}