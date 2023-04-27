import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Room } from '../interfaces/room.interface';

export const getRoom = createParamDecorator(
  <T extends object>(keyName: keyof Room, ctx: ExecutionContext): T => {
    const request: Request = ctx.switchToHttp().getRequest();
    const currentRoom: Room = request.currentRoom;
    if (keyName) return currentRoom[keyName] as T;
    else return currentRoom as T;
  },
);
