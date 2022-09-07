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
  constructor() {
  }


  getFile(targetPath: string): ReadStream {
    return createReadStream(targetPath);
  }

  async getStat(targetPath: string): Promise<Stats> {
    return fs.stat(targetPath);
  }

  async removeByPath(pathFile: string): Promise<void> {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
    }
  }

  async createDirectorie(_path: string): Promise<void> {
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
}
