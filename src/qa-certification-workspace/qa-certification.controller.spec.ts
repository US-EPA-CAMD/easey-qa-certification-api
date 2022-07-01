import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearityInjectionWorkspaceRepository } from '../linearity-injection-workspace/linearity-injection.repository';
import { LinearityInjectionWorkspaceService } from '../linearity-injection-workspace/linearity-injection.service';
import { LinearitySummaryWorkspaceRepository } from '../linearity-summary-workspace/linearity-summary.repository';
import { LinearitySummaryWorkspaceService } from '../linearity-summary-workspace/linearity-summary.service';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { TestSummaryMap } from '../maps/test-summary.map';

import { QACertificationWorkspaceController } from './qa-certification-workspace.controller';
import { QACertificationWorkspaceService } from './qa-certification-workspace.service';
import { QACertificationChecksService } from './qa-certification-checks.service';
import { LocationChecksService } from '../location-workspace/location-checks.service';
import { TestSummaryChecksService } from '../test-summary-workspace/test-summary-checks.service';
import { LocationWorkspaceRepository } from '../location-workspace/location.repository';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';

const qaCertDto = new QACertificationDTO();
const qaParamsDto = new QACertificationParamsDTO();
const payload = new QACertificationImportDTO();

const location = {
  unitId: 'string',
  locationId: 'string',
  stackPipeId: 'string',
  systemIds: ['string'],
  componentIds: ['string'],
};

const mockCheckService = () => ({
  runChecks: jest.fn().mockResolvedValue(''),
});

describe('QA Certification Workspace Controller Test', () => {
  let controller: QACertificationWorkspaceController;
  let service: QACertificationWorkspaceService;
  let checkService: QACertificationChecksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [QACertificationWorkspaceController],
      providers: [
        QACertificationWorkspaceService,
        {
          provide: QACertificationChecksService,
          useFactory: mockCheckService,
        },
        ConfigService,
        TestSummaryWorkspaceService,
        TestSummaryMap,
        LinearitySummaryWorkspaceService,
        TestSummaryWorkspaceRepository,
        LinearitySummaryMap,
        LinearitySummaryWorkspaceRepository,
        LinearityInjectionWorkspaceService,
        LinearityInjectionMap,
        LinearityInjectionWorkspaceRepository,
        LocationChecksService,
        TestSummaryChecksService,
        LocationWorkspaceRepository,
        QASuppDataWorkspaceRepository,
      ],
    }).compile();

    controller = module.get(QACertificationWorkspaceController);
    service = module.get(QACertificationWorkspaceService);
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
      jest.spyOn(checkService, 'runChecks').mockResolvedValue([location]);
      jest.spyOn(service, 'import').mockResolvedValue(undefined);
      expect(await controller.import(payload)).toBe(undefined);
    });
  });
});
