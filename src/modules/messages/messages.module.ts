import { Module } from "@nestjs/common";
import { MessagesRepository } from "./messages.repository";
import { MessagesService } from "./messages.service";

const providersAndExports = [MessagesRepository, MessagesService];

@Module({
  providers: [...providersAndExports],
  exports: [...providersAndExports]
})
export class MessagesModule {
}
