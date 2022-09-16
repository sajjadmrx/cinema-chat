import { Module } from "@nestjs/common";
import { FileModule } from "../file/file.module";
import { FileService } from "../file/file.service";
import { UploadsController } from "./uploads.controller";


const providersAndExports = [FileService];

@Module({
  imports: [FileModule],
  controllers: [UploadsController],
  providers: [...providersAndExports],
  exports: [...providersAndExports]
})
export class UploadsModule {
}