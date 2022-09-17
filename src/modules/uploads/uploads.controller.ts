import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiFile } from "../../shared/decorators/api-File.decorator";
import { movieFilter } from "./filters/movie.filter";
import { movieStorage } from "./storages/movie.storage";
import { ResponseInterceptor } from "../../shared/interceptors/response.interceptor";


@ApiTags("Uploads")
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard("jwt"))
@Controller("uploads")
export class UploadsController {


  @ApiResponse({
    status: 201,
    schema: {
      example: {

        "statusCode": 201,
        "data": "uploads\\movies\\1663400974871-690118608-movie.mp4"
      }
    }
  })
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
    return file.path;
  }
}