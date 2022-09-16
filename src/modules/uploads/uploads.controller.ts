import {
  Body,
  Controller, HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiFile } from "../../shared/decorators/api-File.decorator";
import { movieFilter } from "./filters/movie.filter";
import { movieStorage } from "./storages/movie.storage";
import BestString from "best-string";


@ApiTags("Uploads")
@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@Controller("uploads")
export class UploadsController {

  @ApiOperation({
    summary: "upload a movie"
  })
  @ApiConsumes("multipart/form-data")
  @ApiFile("movie")
  @Post("movie")
  @UseInterceptors(
    FileInterceptor("movie", {
      storage: movieStorage(),
      fileFilter: movieFilter
    })
  )
  movie(@UploadedFile() file: Express.Multer.File) {
    return file.path

  }
}