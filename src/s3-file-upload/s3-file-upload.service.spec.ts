import { Test, TestingModule } from '@nestjs/testing';
import { S3FileUploadService } from './s3-file-upload.service';

describe('S3FileUploadService', () => {
  let service: S3FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3FileUploadService],
    }).compile();

    service = module.get<S3FileUploadService>(S3FileUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
