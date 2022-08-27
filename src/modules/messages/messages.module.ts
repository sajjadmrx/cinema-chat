import { forwardRef, Module } from "@nestjs/common";
import { MessagesRepository } from "./messages.repository";
import { MessagesService } from "./messages.service";
import { RoomsModule } from "../rooms/rooms.module";

const providersAndExports = [MessagesRepository, MessagesService];

@Module({
  imports: [forwardRef(() => RoomsModule)],
  providers: [...providersAndExports],
  exports: [...providersAndExports]
})
export class MessagesModule {
}
