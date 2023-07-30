import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SocketModule } from './modules/websocket/socket.module';
import { RedisModule } from './modules/redis/redis.module';
import { HttpModule } from './modules/http/http.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PrismaModule,
    SocketModule,
    RedisModule,
    HttpModule,
  ],
})
export class AppModule {}
