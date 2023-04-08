import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppModeConstant } from './shared/constants/appMode.constant';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentConfig } from './document.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('port');

  const isDevelopmentMode =
    configService.get<AppModeConstant>('mode') === AppModeConstant.DEVELOPMENT;

  const documentConfig = new DocumentConfig(app, port, 'socket');
  if (isDevelopmentMode) {
    await documentConfig.setupSwagger().async_api(81);
  }

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);

  console.log(`App Running On ${port}`);

  isDevelopmentMode &&
    console.log(`AsyncApi at http://localhost:${port}/socket`);
}

bootstrap();
