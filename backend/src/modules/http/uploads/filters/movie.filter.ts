import { BadRequestException } from '@nestjs/common';

export function movieFilter(req, file, cb) {
  const maxSize = 1024 * 1024 * 100; // 100MB
  if (file.size > maxSize) {
    cb(new BadRequestException('FILE_SIZE_TOO_LARGE'), false);
  }
  if (!file.originalname.match(/\.(mp4|avi)$/)) {
    return cb(new BadRequestException('INVALID_FILE_FORMAT'), false);
  }
  cb(null, true);
}
