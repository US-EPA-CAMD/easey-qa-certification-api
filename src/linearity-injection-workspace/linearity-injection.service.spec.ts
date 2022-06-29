import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import {
  LinearityInjectionImportDTO,
  LinearityInjectionRecordDTO,
} from '../dto/linearity-injection.dto';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

const testSumId = '1';
const linSumId = '1';
const userId = 'testuser';

const lineInjectionDto = new LinearitySummaryDTO();
const lineInjectionRecordDto = new LinearityInjectionRecordDTO();

const payload = new LinearityInjectionImportDTO();

const mockRepository = () => ({});

const mockTestSummaryService = () => ({});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(lineInjectionDto),
  many: jest.fn().mockResolvedValue([lineInjectionDto]),
});

describe('TestSummaryWorkspaceService', () => {
  let service: LinearityInjectionWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearityInjectionWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: LinearityInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: LinearityInjectionMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(LinearityInjectionWorkspaceService);
  });

  describe('import', () => {
    it('Should import Linearity Summary', async () => {
      jest
        .spyOn(service, 'createInjection')
        .mockResolvedValue(lineInjectionRecordDto);
      const result = await service.import(testSumId, linSumId, payload, userId);
      expect(result).toEqual(null);
    });
  });
});
