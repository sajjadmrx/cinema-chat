import {
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { movieFilter } from './filters/movie.filter';
import { movieStorage } from './storages/movie.storage';
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';
import { UploadsService } from './uploads.service';
import { ExpressFile } from '../../shared/interfaces/file.interface';
import { ApiUploadMedia } from './docs/uploadMedia.doc';
import { HttpExceptionFilter } from '../../shared/filters/httpException.filter';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('uploads')
export class UploadsController {
  constructor(private uploadService: UploadsService) {}

  @ApiUploadMedia()
  @Post('movie')
  @UseInterceptors(
    FileInterceptor('movie', {
      storage: movieStorage(),
      fileFilter: movieFilter,
    }),
  )
  movie(@UploadedFile() file: ExpressFile) {
    return this.uploadService.uploadMovie(file);
  }
}
