import {Controller, HttpStatus, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { S3FileUploadService } from './s3-file-upload.service';
import {EaseyException} from "@us-epa-camd/easey-common/exceptions";

const MAX_UPLOAD_SIZE_MB: number = 30;

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
        const fileErrors = [];
        if(file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024)
            fileErrors.push(`Uploaded file exceeds maximum size of ${MAX_UPLOAD_SIZE_MB}M`);
        if(! ['application/pdf','application/xml','text/xml'].includes(file.mimetype))
            fileErrors.push('Only XML and PDF files may be uploaded');

        if(fileErrors.length > 0)
            throw new EaseyException(
                new Error(fileErrors.join('\n')),
                HttpStatus.BAD_REQUEST,
                { responseObject: fileErrors }
            )

        this.service.uploadFile(file.originalname, file.buffer)
    }
}
