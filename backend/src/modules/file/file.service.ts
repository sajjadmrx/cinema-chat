import { Injectable } from '@nestjs/common';

import {
  promises as fs,
  ReadStream,
  createReadStream,
  Stats,
  constants as fileConstant,
} from 'fs';




@Injectable()
export class FileService {
  constructor() {}

  getFile(targetPath: string): ReadStream {
    return createReadStream(targetPath);
  }

  async getStat(targetPath: string): Promise<Stats> {
    return fs.stat(targetPath);
  }

  async removeByPath(pathFile: string): Promise<void> {
    try {
      await fs.unlink(pathFile);
    } catch (error) {}
  }

  async createDirectory(_path: string): Promise<void> {
    try {
      await fs.mkdir(_path, { recursive: true });
    } catch (e) {
      throw e;
    }
  }

  async checkFileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath, fileConstant.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  streamFile(src: string, start: number, end: number): ReadStream {
    return createReadStream(src, { start, end });
  }

  // convertToHlsVideo(videoPath: string, hlsFolderPath: string, outId: string) {
  //   return new Promise((resolve, reject) => {
  //     const outPath: string = join(hlsFolderPath, `${outId}.m3u8`);
  //     ffmpeg(videoPath)
  //       .addOptions([
  //         '-profile:v baseline',
  //         '-level 3.0',
  //         '-s 640x360',
  //         '-start_number 0',
  //         '-hls_time 10',
  //         '-hls_list_size 0',
  //         '-f hls',
  //       ])
  //       .output(outPath)
  //       .on('end', () => {
  //         console.log(`Video conversion completed for ${outId}`);
  //         resolve(outPath);
  //       })
  //       .run();
  //   });
  // }
}
