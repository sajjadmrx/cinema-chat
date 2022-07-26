import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from "@nestjs/mongoose";
import configuration from "./config/configuration";
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true
        }),
        PrismaModule
    ],
})
export class AppModule { }