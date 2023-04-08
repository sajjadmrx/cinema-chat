import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFile } from '../../shared/decorators/api-File.decorator';
import { movieFilter } from './filters/movie.filter';
import { movieStorage } from './storages/movie.storage';
import { ResponseInterceptor } from '../../shared/interceptors/response.interceptor';
import { UploadsService } from './uploads.service';
import { ExpressFile } from '../../shared/interfaces/file.interface';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseInterceptors(ResponseInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('uploads')
export class UploadsController {
  constructor(private uploadService: UploadsService) {}

  @ApiResponse({
    status: 201,
    schema: {
      example: {
        statusCode: 201,
        data: {
          mediaSrc: 'uploads/movies/xxx.mp4',
          hlsPath: 'hls/xx',
          hlsPlaylistPath: 'hls/xx/xxx_480_hls.m3u8',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'upload a movie',
  })
  @ApiConsumes('multipart/form-data')
  @ApiFile('movie')
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
