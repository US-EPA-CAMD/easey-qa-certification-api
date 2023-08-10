import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { S3FileUploadService } from './s3-file-upload.service';

@Controller()
@ApiTags("File Upload")
@ApiSecurity('APIKey')
export class S3FileUploadController {

    constructor(private service: S3FileUploadService) {}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        this.service.uploadFile(file.originalname, file.buffer)
    }
}
