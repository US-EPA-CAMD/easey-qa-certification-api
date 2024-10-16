import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { DataSource } from 'typeorm';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { EntityManager } from 'typeorm';

import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';
import { MatsBulkFileDTO } from '../dto/mats-bulk-file.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';
import { ReviewAndSubmitMultipleParamsMatsDTO } from '../dto/review-and-submit-multiple-params-mats.dto';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { CertEventReviewAndSubmitMap } from '../maps/cert-event-review-and-submit.map';
import { MatsBulkFileMap } from '../maps/mats-bulk-file.map';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { TeeReviewAndSubmitMap } from '../maps/tee-review-and-submit.map';
import { CertEventReviewAndSubmitGlobalRepository } from './cert-event-review-and-submit-global.repository';
import { CertEventReviewAndSubmitRepository } from './cert-event-review-and-submit.repository';
import { CertEventReviewAndSubmitService } from './cert-event-review-and-submit.service';
import { MatsBulkFilesReviewAndSubmitRepository } from './mats-bulk-files-review-and-submit.repository';
import { MatsBulkFilesReviewAndSubmitService } from './mats-bulk-files-review-and-submit.service';
import { QACertificationChecksService } from './qa-certification-checks.service';
import { QACertificationWorkspaceController } from './qa-certification.controller';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { TeeReviewAndSubmitGlobalRepository } from './tee-review-and-submit-global.repository';
import { TeeReviewAndSubmitRepository } from './tee-review-and-submit.repository';
import { TeeReviewAndSubmitService } from './tee-review-and-submit.service';
import { TestSummaryReviewAndSubmitGlobalRepository } from './test-summary-review-and-submit-global.repository';
import { TestSummaryReviewAndSubmitRepository } from './test-summary-review-and-submit.repository';
import { TestSummaryReviewAndSubmitService } from './test-summary-review-and-submit.service';
import { EaseyContentService } from '../qa-certification-easey-content/easey-content.service';

const qaCertDto = new QACertificationDTO();
const qaParamsDto = new QACertificationParamsDTO();
const payload = new QACertificationImportDTO();

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const qaSuppData = new QASuppData();
const location = {
  unitId: 'string',
  locationId: 'string',
  stackPipeId: 'string',
  systemIDs: ['string'],
  componentIDs: ['string'],
};

const mockService = () => ({
  import: jest.fn(),
  export: jest.fn(),
});

const mockCheckService = () => ({
  runChecks: jest.fn().mockResolvedValue(''),
});

describe('QA Certification Workspace Controller Test', () => {
  let controller: QACertificationWorkspaceController;
  let service: QACertificationWorkspaceService;
  let reviewSubmitServiceCert: CertEventReviewAndSubmitService;
  let reviewSubmitServiceTestSum: TestSummaryReviewAndSubmitService;
  let reviewSubmitServiceTee: TeeReviewAndSubmitService;
  let reviewSubmitMats: MatsBulkFilesReviewAndSubmitService;
  let checkService: QACertificationChecksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [QACertificationWorkspaceController],
      providers: [
        EaseyContentService,
        ConfigService,
        AuthGuard,
        EntityManager,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: QACertificationWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: QACertificationChecksService,
          useFactory: mockCheckService,
        },
        CertEventReviewAndSubmitService,
        CertEventReviewAndSubmitRepository,
        CertEventReviewAndSubmitGlobalRepository,
        CertEventReviewAndSubmitMap,
        TestSummaryReviewAndSubmitRepository,
        TestSummaryReviewAndSubmitGlobalRepository,
        TestSummaryReviewAndSubmitService,
        ReviewAndSubmitTestSummaryMap,
        TeeReviewAndSubmitService,
        TeeReviewAndSubmitRepository,
        TeeReviewAndSubmitGlobalRepository,
        TeeReviewAndSubmitMap,
        MatsBulkFilesReviewAndSubmitRepository,
        MatsBulkFilesReviewAndSubmitService,
        MatsBulkFileMap,
      ],
    }).compile();

    controller = module.get(QACertificationWorkspaceController);
    service = module.get(QACertificationWorkspaceService);
    reviewSubmitServiceCert = module.get(CertEventReviewAndSubmitService);
    reviewSubmitServiceTestSum = module.get(TestSummaryReviewAndSubmitService);
    reviewSubmitServiceTee = module.get(TeeReviewAndSubmitService);
    reviewSubmitMats = module.get(MatsBulkFilesReviewAndSubmitService);
    checkService = module.get(QACertificationChecksService);
  });

  describe('export', () => {
    it('should export QA & Cert Data', async () => {
      jest.spyOn(service, 'export').mockResolvedValue(qaCertDto);
      expect(await controller.export(qaParamsDto)).toBe(qaCertDto);
    });
  });

  describe('import', () => {
    it('should import QA & Cert Data', async () => {
      jest
        .spyOn(checkService, 'runChecks')
        .mockResolvedValue([[location], [qaSuppData]]);
      jest.spyOn(service, 'import').mockResolvedValue(undefined);
      expect(await controller.import(payload, user)).toBe(undefined);
    });
  });

  describe('getCertEventFiltered', () => {
    it('should call the review and submit cert event controller function and return a list of dtos', async () => {
      const dto = new CertEventReviewAndSubmitDTO();
      reviewSubmitServiceCert.getCertEventRecords = jest
        .fn()
        .mockResolvedValue([dto]);

      const result = await controller.getFilteredCerts(
        new ReviewAndSubmitMultipleParamsDTO(),
      );

      expect(result).toEqual([dto]);
    });
  });

  describe('getTestSummaryFiltered', () => {
    it('should call the review and submit test summary controller function and return a list of dtos', async () => {
      const dto = new ReviewAndSubmitTestSummaryDTO();
      reviewSubmitServiceTestSum.getTestSummaryRecords = jest
        .fn()
        .mockResolvedValue([dto]);

      const result = await controller.getFilteredTestSums(
        new ReviewAndSubmitMultipleParamsDTO(),
      );

      expect(result).toEqual([dto]);
    });
  });

  describe('getTeeFiltered', () => {
    it('should call the review and submit test extension exemption controller function and return a list of dtos', async () => {
      const dto = new TeeReviewAndSubmitDTO();
      reviewSubmitServiceTee.getTeeRecords = jest.fn().mockResolvedValue([dto]);

      const result = await controller.getFilteredTee(
        new ReviewAndSubmitMultipleParamsDTO(),
      );

      expect(result).toEqual([dto]);
    });
  });

  describe('getMatsBulkFiltered', () => {
    it('should call the review and submit test summary controller function and return a list of dtos', async () => {
      const dto = new MatsBulkFileDTO();
      reviewSubmitMats.getMatsBulkFileRecords = jest
        .fn()
        .mockResolvedValue([dto]);

      const result = await controller.getFilteredMatsBulkFile(
        new ReviewAndSubmitMultipleParamsMatsDTO(),
      );

      expect(result).toEqual([dto]);
    });
  });
});
