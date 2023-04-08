import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ChatGateway } from '../chat.gateway';

@Injectable()
export class StreamEventService {
  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
  ) {}
}
