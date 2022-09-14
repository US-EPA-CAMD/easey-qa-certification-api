import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummary } from '../entities/linearity-summary.entity';
import { LinearitySummaryRepository } from '../linearity-summary/linearity-summary.repository';
import { LinearityInjectionImportDTO } from '../dto/linearity-injection.dto';
import {
  LinearitySummaryDTO,
  LinearitySummaryImportDTO,
  LinearitySummaryRecordDTO,
} from '../dto/linearity-summary.dto';
import { LinearityInjectionWorkspaceService } from '../linearity-injection-workspace/linearity-injection.service';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';

const testSumId = '1';
const userId = 'testuser';

const lineSummaryDto = new LinearitySummaryDTO();
const lineSummaryRecordDto = new LinearitySummaryRecordDTO();

const payload = new LinearitySummaryImportDTO();
payload.linearityInjectionData = [new LinearityInjectionImportDTO()];

const mockRepository = () => ({});
const mockOfficialRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new LinearitySummary()),
});

const mockTestSummaryService = () => ({});

const mockLinearityInjectionService = () => ({
  import: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(lineSummaryDto),
  many: jest.fn().mockResolvedValue([lineSummaryDto]),
});

describe('LinearitySummaryWorkspaceService', () => {
  let service: LinearitySummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearitySummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: LinearityInjectionWorkspaceService,
          useFactory: mockLinearityInjectionService,
        },
        {
          provide: LinearitySummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: LinearitySummaryRepository,
          useFactory: mockOfficialRepository,
        },
        {
          provide: LinearitySummaryMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(LinearitySummaryWorkspaceService);
  });

  describe('import', () => {
    it('Should import Linearity Summary', async () => {
      jest
        .spyOn(service, 'createSummary')
        .mockResolvedValue(lineSummaryRecordDto);
      const result = await service.import(testSumId, payload, userId);
      expect(result).toEqual(null);
    });
  });
});
