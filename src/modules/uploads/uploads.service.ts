import { Injectable } from "@nestjs/common";
import { FileService } from "../file/file.service";

@Injectable()
export class UploadsService {
  constructor(private fileService: FileService) {
  }
}