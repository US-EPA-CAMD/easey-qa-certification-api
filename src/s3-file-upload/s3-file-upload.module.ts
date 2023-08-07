import { Module } from '@nestjs/common';
import { S3FileUploadService } from './s3-file-upload.service';
import { S3FileUploadController } from './s3-file-upload.controller';

@Module({
  controllers: [S3FileUploadController],
  providers: [S3FileUploadService]
})
export class S3FileUploadModule {}
