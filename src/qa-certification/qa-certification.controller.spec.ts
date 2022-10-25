import { Test, TestingModule } from '@nestjs/testing';
import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationDTO } from '../dto/qa-certification.dto';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('QA Certification Controller Test', () => {
  let controller: QACertificationController;
  let service: QACertificationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [QACertificationController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: QACertificationService,
          useFactory: () => ({
            export: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get(QACertificationController);
    service = module.get(QACertificationService);
  });

  it('should export QA-Cert', async () => {
    const expectedResult = new QACertificationDTO();
    const paramsDto = new QACertificationParamsDTO();
    jest.spyOn(service, 'export').mockResolvedValue(expectedResult);
    expect(await controller.export(paramsDto)).toEqual(expectedResult);
  });
});
