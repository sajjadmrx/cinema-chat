import { User as _User } from 'src/shared/interfaces/user.interface';
import { Room } from 'src/shared/interfaces/room.interface';
import { Member } from 'src/shared/interfaces/member.interface';

declare global {
  namespace Express {
    interface User extends _User {}

    interface Request {
      currentRoom: Room;
      currentMember: Member;
    }
  }
}
//
// declare module 'socket.io' {
//   interface Socket {
//     data: {
//       userId: number;
//     };
//   }
// }
