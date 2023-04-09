import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatGateway } from '../chat.gateway';
import { Socket } from 'socket.io';
import { Member } from '../../../shared/interfaces/member.interface';
import { MemberStatusConstant } from '../../../shared/constants/member.constant';
import { AuthService } from '../../auth/auth.service';
import { MembersDbRepository } from '../../members/repositories/members-db.repository';
import { ChatEmits } from '../chat.emits';

@Injectable()
export class ConnectionService {
  private logger: Logger = new Logger(ConnectionService.name);

  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private authService: AuthService,
    private membersRepo: MembersDbRepository,
    private chatEmits: ChatEmits,
  ) {}

  async handleConnection(client: Socket) {
    try {
      this.logger.log(`Connected ${client.id}`);
      const authorization: string | null =
        client.handshake.auth.Authorization ||
        client.handshake.headers['authorization'];
      if (!authorization) throw new UnauthorizedException();

      const token: string | null = authorization.split(' ')[1];
      const result = this.authService.jwtVerify(token);
      const userId = result.userId;

      const members: Member[] = await this.membersRepo.findByUserId(userId);

      members.map((member: Member) => {
        client.join(member.roomId.toString());
        // update User Status
        this.chatEmits.updateMemberStatus(
          member.roomId,
          member.userId,
          MemberStatusConstant.ONLINE,
        );
      });

      client.data.userId = userId;
    } catch (e) {
      this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`IOClient disconnected: ${client.id}`);
    const userId: number = client.data.userId;
    const members: Member[] = await this.membersRepo.findByUserId(userId);

    members.map((member: Member) => {
      client.join(member.roomId.toString());
      // update User Status
      this.chatEmits.updateMemberStatus(
        member.roomId,
        member.userId,
        MemberStatusConstant.OFFLINE,
      );
    });
  }

  private disconnect(socket: Socket) {
    socket.emit('error', new UnauthorizedException());
    socket.disconnect();
  }
}
