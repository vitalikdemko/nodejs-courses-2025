import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZipService } from './zip.service.js';
import { Express } from 'express';

@Controller()
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Get()
  getHello() {
    return 'Server is running';
  }

  @Post('zip')
  @UseInterceptors(FileInterceptor('zip', { dest: '/tmp' }))
  async handleZipUpload(@UploadedFile() file: Express.Multer.File) {
    return this.zipService.processZip(file.path);
  }
}
