import { Test, TestingModule } from '@nestjs/testing';
import { S3FileUploadService } from './s3-file-upload.service';
import { ConfigService } from '@nestjs/config';

describe('S3FileUploadService', () => {
  let service: S3FileUploadService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3FileUploadService, ConfigService],
    }).compile();

    service = module.get(S3FileUploadService);
    configService = module.get(ConfigService);

    const mS3ClientInstance = {
      upload: jest.fn().mockReturnThis(),
    };
    
    jest.mock('@aws-sdk/client-s3', () => { 
      S3Client: jest.fn(() => mS3ClientInstance) 
      PutObjectCommand: jest.fn(() => {})
    });

    mS3ClientInstance.upload.mockResolvedValue('fake response');

  });

  it('should be defined', async () => {
    expect(service).toBeDefined()
  });
});


// describe('S3FileUploadService', () => {
//   let service: S3FileUploadService;
//   let configService: ConfigService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [S3FileUploadService, ConfigService],
//     }).compile();

//     service = module.get(S3FileUploadService);
//     configService = module.get(ConfigService);

//     const mS3ClientInstance = {
//       upload: jest.fn().mockReturnThis(),
//     };
    
//     jest.mock('@aws-sdk/client-s3', () => { 
//       S3Client: jest.fn(() => mS3ClientInstance) 
//       PutObjectCommand: jest.fn(() => {})
//     });

//     mS3ClientInstance.upload.mockResolvedValue('fake response');

//   });

//   it('should be defined', async () => {


//     jest.spyOn(configService, 'get').mockReturnValue("value");

//     await expect(service.uploadFile('name', Buffer.from('ok'))).resolves;

//   });
// });
