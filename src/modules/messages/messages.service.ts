import { MessagesRepository } from "./messages.repository";
import { MessageCreateInput } from "../../shared/interfaces/message.interface";

export class MessagesService {
  constructor(private messagesRepository: MessagesRepository) {
  }


  async create(roomId: number, memberId: number, input: MessageCreateInput) {
    const message = await this.messagesRepository.create({
      roomId,
      authorId: memberId,
      replyId: input.roomId,
      content: input.content,
      type: 'TEXT',
    })

    //socket processes
  }
}