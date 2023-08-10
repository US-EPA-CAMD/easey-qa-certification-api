import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3FileUploadService {

    private s3Client;

    constructor(private readonly configService: ConfigService){
        if( !this.configService.get("AWS_S3_REGION") ||
            !this.configService.get("AWS_S3_BUCKET_NAME") ||
            !this.configService.get("AWS_ACCESS_KEY_ID") ||
            !this.configService.get("AWS_SECRET_ACCESS_KEY")

        ){
            throw new Error("AWS information not set")
        }

        this.s3Client = new S3Client({
            region: this.configService.get("AWS_S3_REGION")
        })
    }

 

    async uploadFile(fileName: string, file: Buffer){
        return await this.s3Client.send(new PutObjectCommand({
            Body: file,
            Key: fileName,
            Bucket: this.configService.get("AWS_S3_BUCKET_NAME"),
        }))
    }
}
