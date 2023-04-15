import { Global, Module } from '@nestjs/common';
import { RedisModule as _RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    _RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        config: { url: configService.get('REDIS_URL') },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
