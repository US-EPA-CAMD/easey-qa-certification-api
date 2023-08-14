import { Test, TestingModule } from '@nestjs/testing';
import { S3FileUploadController } from './s3-file-upload.controller';
import { ConfigService } from '@nestjs/config';
import { S3FileUploadService } from './s3-file-upload.service';

const file = {
  originalname: 'sample.name',
  mimetype: 'application/pdf',
  path: 'sample.url',
  buffer: Buffer.from('test'),
  fieldname: 'sample.fieldname',
  encoding: 'sample.encoding',
  size: 1000,
  stream: null,
  destination:'sample.destination',
  filename: 'sample.filename'
};

describe('S3FileUploadController', () => {
  let controller: S3FileUploadController;
  let service: S3FileUploadService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3FileUploadController],
      providers: [ConfigService, S3FileUploadService]
    }).compile();

    controller = module.get(S3FileUploadController);
    service = module.get(S3FileUploadService);
    configService = module.get(ConfigService);

    
    const mS3ClientInstance = {
      upload: jest.fn().mockReturnThis(),
    };
    
    jest.mock('@aws-sdk/client-s3', () => { 
      S3Client: jest.fn(() => mS3ClientInstance) 
      PutObjectCommand: jest.fn(() => {})
    });


  });

  it('should be defined', async () => {
    jest.spyOn(configService, 'get').mockReturnValue("value");
    jest.spyOn(service, 'uploadFile').mockResolvedValue(null);
    await expect( controller.uploadFile(file)).resolves;

  });

  it('Should fail if mime type is not pdf or xml', async() => {
    jest.spyOn(service, 'uploadFile').mockResolvedValue(null);

    const testFile = {...file, mimetype: 'text/xml'};
    expect(controller.uploadFile(testFile));

    testFile.mimetype = 'application/xml';
    expect(controller.uploadFile(testFile));

    testFile.mimetype = 'application/pdf';
    expect(controller.uploadFile(testFile));

    testFile.mimetype='image/png'
    expect(() => controller.uploadFile(testFile)).toThrowError();
  })

  it('Should fail if file size is > 30M', async () => {
    const testFile = {...file, size: (30 * 1024 * 1024 + 1)};
    expect(() => controller.uploadFile(testFile)).toThrowError();
  })
});
