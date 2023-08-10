import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class S3FileUploadService {
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {}

  async uploadFile(fileName: string, file: Buffer) {
    if (
      !this.configService.get<string>('app.awsRegion') ||
      !this.configService.get<string>('app.awsBucket') ||
      !this.configService.get<string>('app.awsAccessKey') ||
      !this.configService.get<string>('app.awsSecretAccessKey')
    ) {
      throw new EaseyException(
        new Error('No AWS credentials'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('app.awsAccessKey'),
        secretAccessKey: this.configService.get<string>(
          'app.awsSecretAccessKey',
        ),
      },
      region: this.configService.get<string>('app.awsRegion'),
    });

    return this.s3Client.send(
      new PutObjectCommand({
        Body: file,
        Key: fileName,
        Bucket: this.configService.get<string>('app.awsBucket'),
      }),
    );
  }
}
