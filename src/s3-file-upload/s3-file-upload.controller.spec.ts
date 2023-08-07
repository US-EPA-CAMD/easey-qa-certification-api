import { Test, TestingModule } from '@nestjs/testing';
import { S3FileUploadController } from './s3-file-upload.controller';

describe('S3FileUploadController', () => {
  let controller: S3FileUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3FileUploadController],
    }).compile();

    controller = module.get<S3FileUploadController>(S3FileUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
