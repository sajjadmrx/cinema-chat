import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigsType } from './configuration';
import { DocumentConfig } from './document.config';
import { AppModeConstant } from './shared/constants/appMode.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService<ConfigsType>);
  const port: number = configService.get<number>('port');
  console.log(process.env.PORT);
  const isDevelopmentMode =
    configService.get<AppModeConstant>('APP_MODE') ===
    AppModeConstant.DEVELOPMENT;

  const documentConfig = new DocumentConfig(app, port, 'socket');
  if (isDevelopmentMode) {
    await documentConfig.setupSwagger().async_api(81);
  }

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);

  console.log(`App Running On ${port}`);

  if (isDevelopmentMode) {
    console.log(`AsyncApi at http://localhost:${port}/socket`);
    console.log(`RestApi Docs: http://localhost:${port}/api`);
  }
}

bootstrap();
