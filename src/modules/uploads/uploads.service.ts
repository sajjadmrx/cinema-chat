import { Injectable } from "@nestjs/common";
import { FileService } from "../file/file.service";
import { ExpressFile } from "../../shared/interfaces/file.interface";

@Injectable()
export class UploadsService {
  private hlsFolderPath: string = "hls";

  constructor(private fileService: FileService) {
  }


  async uploadMovie(file: ExpressFile) {


    const parts = file.originalname.split(".");
    const filename = parts.slice(0, -1).join(".");

    const outId: string = `${filename}_480_hls`;
    const outHlsFolder: string = `${this.hlsFolderPath}/${filename}`;

    const isExists = await this.fileService.checkFileExists(outHlsFolder);
    if (!isExists)
      await this.fileService.createDirectory(outHlsFolder);

    // todo Add to queue
    const hlsPlaylistPath = await this.fileService.convertToHlsVideo(file.path, outHlsFolder, outId);
    return {
      mediaSrc: file.path,
      hlsPath: outHlsFolder,
      hlsPlaylistPath
    };
  }


}
