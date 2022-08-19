export class MessageCreateDto {
  content: string;
  replyId: number | null;
  roomId: number;
  //TODO add: attachments;

}