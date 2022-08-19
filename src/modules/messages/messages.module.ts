import { Module } from "@nestjs/common";
import { MessagesRepository } from "./messages.repository";

const providersAndExports = [MessagesRepository];

@Module({
  providers: [...providersAndExports],
  exports: [...providersAndExports]
})
export class MessagesModule {
}
