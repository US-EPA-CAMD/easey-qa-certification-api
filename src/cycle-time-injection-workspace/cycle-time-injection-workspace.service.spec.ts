import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import {
  CycleTimeInjectionDTO,
  CycleTimeInjectionImportDTO,
  CycleTimeInjectionRecordDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjection } from '../entities/workspace/cycle-time-injection.entity';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeInjectionWorkspaceService } from './cycle-time-injection-workspace.service';

const testSumId = '1';
const cycleTimeSumId = '1';
const cycleTimeInjId = '1';
const userId = 'testuser';

const cycleTimeInjection = new CycleTimeInjection();
const cycleTimeInjectionDTO = new CycleTimeInjectionDTO();
const cycleTimeInjectionRecordDto = new CycleTimeInjectionRecordDTO();

const payload = new CycleTimeInjectionImportDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([cycleTimeInjection]),
  create: jest.fn().mockResolvedValue(cycleTimeInjection),
  save: jest.fn().mockResolvedValue(cycleTimeInjection),
  findOne: jest.fn().mockResolvedValue(cycleTimeInjection),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(cycleTimeInjectionDTO),
  many: jest.fn().mockResolvedValue([cycleTimeInjectionDTO]),
});

describe('CycleTimeInjectionWorkspaceService', () => {
  let service: CycleTimeInjectionWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        CycleTimeInjectionWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: CycleTimeInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: CycleTimeInjectionMap,
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

    service = module.get<CycleTimeInjectionWorkspaceService>(
      CycleTimeInjectionWorkspaceService,
    );
  });

  describe('createInjection', () => {
    it('Should insert a Linearity Injection record', async () => {
      const result = await service.createCycleTimeInjection(
        testSumId,
        cycleTimeSumId,
        payload,
        userId,
      );
      expect(result).toEqual(cycleTimeInjectionDTO);
    });
  });
});
