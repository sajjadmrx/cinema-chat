import { INestApplication } from '@nestjs/common';
import {
  AsyncApiDocumentBuilder,
  AsyncApiModule,
  AsyncServerObject,
} from 'nestjs-asyncapi';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class DocumentConfig {
  constructor(
    private app: INestApplication,
    private port: number,
    private docRelPath: string,
  ) {}

  async async_api(socketServerPort: number) {
    try {
      const asyncApiServer: AsyncServerObject = {
        url: `ws://localhost:${socketServerPort}`,
        protocol: 'socket.io',
        protocolVersion: '4',
        description:
          'Allows you to connect using the websocket protocol to our Socket.io server.',
        security: [{ 'user-password': [] }],
        variables: {
          port: {
            description:
              'Secure connection (TLS) is available through port 443.',
            default: '443',
          },
        },
        bindings: {},
      };

      const asyncApiOptions = new AsyncApiDocumentBuilder()
        .setTitle('cinema SocketIO')
        .setDescription('Cats SocketIO description here')
        .setVersion('1.0')
        .setDefaultContentType('application/json')
        .addSecurity('user-password', { type: 'userPassword' })
        .addServer('cats-server', asyncApiServer)
        .build();
      const asyncapiDocument = await AsyncApiModule.createDocument(
        this.app,
        asyncApiOptions,
      );
      await AsyncApiModule.setup(this.docRelPath, this.app, asyncapiDocument);
    } catch (e) {
      console.log(e);
    }
  }

  setupSwagger(): this {
    const config = new DocumentBuilder()
      .setTitle('Cinema Document')
      .setDescription(
        `The Cinema APIs, Response Format : \n
       \n
        {
            statusCode: int,
            data : any
        }
    `,
      )
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        name: 'Authorization',
      })
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('api', this.app, document); //It only works on development mode
    return this;
  }
}
