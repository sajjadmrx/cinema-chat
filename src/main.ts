import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppModeConstant } from './shared/constants/appMode.constant';
import { ConfigService, NoInferType } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ChatFa Document')
    .setDescription('The ChatFa APIs')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      name: 'Authorization',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const configService = app.get(ConfigService);

  if (
    configService.get<AppModeConstant>('mode') === AppModeConstant.DEVELOPMENT
  )
    SwaggerModule.setup('api', app, document); //It only works on development mode

  const port: number = configService.get<number>('port');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  console.log(`App Running On ${port}`);
}
bootstrap();
