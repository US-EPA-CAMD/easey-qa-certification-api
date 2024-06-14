import { Test, TestingModule } from '@nestjs/testing';
import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationDTO } from '../dto/qa-certification.dto';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { CertEventReviewAndSubmitService } from '../qa-certification-workspace/cert-event-review-and-submit.service';
import { TestSummaryReviewAndSubmitService } from '../qa-certification-workspace/test-summary-review-and-submit.service';
import { TeeReviewAndSubmitService } from '../qa-certification-workspace/tee-review-and-submit.service';
import { EaseyContentService } from '../qa-certification-easey-content/easey-content.service';

jest.mock('../qa-certification-workspace/cert-event-review-and-submit.service');
jest.mock(
  '../qa-certification-workspace/test-summary-review-and-submit.service',
);
jest.mock('../qa-certification-workspace/tee-review-and-submit.service');

describe('QA Certification Controller Test', () => {
  let controller: QACertificationController;
  let service: QACertificationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [QACertificationController],
      providers: [
        EaseyContentService,
        ConfigService,
        AuthGuard,
        {
          provide: QACertificationService,
          useFactory: () => ({
            export: jest.fn(),
          }),
        },
        CertEventReviewAndSubmitService,
        TestSummaryReviewAndSubmitService,
        TeeReviewAndSubmitService,
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
