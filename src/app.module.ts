import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { RoomsModule } from "./modules/rooms/rooms.module";
import { InvitesModule } from "./modules/invites/invites.module";
import { MembersModule } from "./modules/members/members.module";
import { ChatModule } from "./modules/chat/chat.module";
import { MessagesModule } from "./modules/messages/messages.module";
import { MoviesModule } from "./modules/movies/movies.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    RoomsModule,
    InvitesModule,
    MembersModule,
    ChatModule,
    MessagesModule,
    MoviesModule
  ]
})
export class AppModule {
}
