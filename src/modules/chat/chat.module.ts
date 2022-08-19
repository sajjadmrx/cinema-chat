import { forwardRef, Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { RoomsModule } from "../rooms/rooms.module";
import { ChatEmits } from "./chat.emits";

const providersAndExports = [ChatService, ChatGateway, ChatEmits];

@Module({
  imports: [AuthModule, forwardRef(() => RoomsModule), UsersModule],
  providers: [...providersAndExports],
  exports: [...providersAndExports]
})
export class ChatModule {
}
