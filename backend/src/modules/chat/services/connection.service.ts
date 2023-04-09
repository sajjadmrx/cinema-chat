import {
  BadRequestException,
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
import { ChatEmits } from '../chat.emits';
import { UserSocketManager } from '../userSocket.manager';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ResponseMessages } from '../../../shared/constants/response-messages.constant';
import { MembersRepository } from '../../members/repositories/members.repository';

@Injectable()
export class ConnectionService {
  private logger: Logger = new Logger(ConnectionService.name);

  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    private authService: AuthService,
    private membersRepo: MembersRepository,
    private chatEmits: ChatEmits,
    private userSocketManager: UserSocketManager,
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

      const userSocket = await this.userSocketManager.findOneSocketByUserId(
        userId,
      );
      if (userSocket) {
        this.disconnect(
          client,
          new BadRequestException(ResponseMessages.ONLY_ONE_DEVICE_ALLOWED),
        ); // only 1 device
        return;
      }

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
      this.disconnect(client, new UnauthorizedException());
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

  private disconnect(socket: Socket, error: HttpException) {
    socket.emit('error', error);
    socket.disconnect();
  }
}
