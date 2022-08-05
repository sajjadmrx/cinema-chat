import { User as _User } from 'src/shared/interfaces/user.interface';
import { Room } from 'src/shared/interfaces/room.interface';

declare global {
  namespace Express {
    interface User extends _User {}

    interface Request {
      currentRoom: Room;
    }
  }
}
