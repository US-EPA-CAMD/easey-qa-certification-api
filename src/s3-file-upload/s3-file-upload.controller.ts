import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags("File Upload")
export class S3FileUploadController {

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiSecurity('APIKey')
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }
}
