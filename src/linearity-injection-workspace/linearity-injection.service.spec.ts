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
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';

const testSumId = '1';
const linSumId = '1';
const linInjId = '1';
const userId = 'testuser';

const lineInjection = new LinearitySummary();
const lineInjectionDto = new LinearitySummaryDTO();
const lineInjectionRecordDto = new LinearityInjectionRecordDTO();

const payload = new LinearityInjectionImportDTO();

const mockRepository = () => ({
  create: jest.fn().mockResolvedValue(lineInjection),
  save: jest.fn().mockResolvedValue(lineInjection),
  findOne: jest.fn().mockResolvedValue(lineInjection),
});

const mockTestSummaryService = () => ({});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(lineInjectionDto),
  many: jest.fn().mockResolvedValue([lineInjectionDto]),
});

describe('TestSummaryWorkspaceService', () => {
  let service: LinearityInjectionWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;

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
        {
          provide: TestSummaryWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn().mockResolvedValue(null),
          }),
        },
      ],
    }).compile();

    service = module.get(LinearityInjectionWorkspaceService);
    testSummaryService = module.get(TestSummaryWorkspaceService);
  });

  describe('import', () => {
    it('Should import Linearity Injection', async () => {
      jest
        .spyOn(service, 'createInjection')
        .mockResolvedValue(lineInjectionRecordDto);
      const result = await service.import(testSumId, linSumId, payload, userId);
      expect(result).toEqual(null);
    });
  });

  describe('createInjection', () => {
    it('Should insert a Linearity Injection record', async () => {
      const result = await service.createInjection(
        testSumId,
        linSumId,
        payload,
        userId,
      );
      expect(result).toEqual(lineInjectionDto);
    });
  });

  describe('updateInjection', () => {
    it('Should update a Linearity Injection record', async () => {
      const result = await service.updateInjection(
        testSumId,
        linInjId,
        payload,
        userId,
      );
      expect(result).toEqual(lineInjectionDto);
    });
  });
});
