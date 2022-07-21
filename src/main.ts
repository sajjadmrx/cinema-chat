import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import { AppModeConstant } from './shared/constants/appMode.constant';
config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ChatFa Document')
    .setDescription('The ChatFa APIs')
    .setVersion('1.0')
    .build();


  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV == AppModeConstant.DEVELOPMENT)
    SwaggerModule.setup('api', app, document);//It only works on development mode

  await app.listen(3000);
}
bootstrap();
