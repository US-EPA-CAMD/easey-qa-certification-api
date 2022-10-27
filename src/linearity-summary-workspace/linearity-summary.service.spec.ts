import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummary } from '../entities/linearity-summary.entity';
import { LinearitySummaryRepository } from '../linearity-summary/linearity-summary.repository';
import {
  LinearitySummaryBaseDTO,
  LinearitySummaryDTO,
  LinearitySummaryImportDTO,
} from '../dto/linearity-summary.dto';
import { LinearityInjectionWorkspaceService } from '../linearity-injection-workspace/linearity-injection.service';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';

const id = '';
const testSumId = '1';
const userId = 'testuser';
const entity = new LinearitySummary();
const linearitySummaryRecord = new LinearitySummaryDTO();
const linearitySummaryRecords = [linearitySummaryRecord];

const payload = new LinearitySummaryBaseDTO();

const mockRepository = () => ({
  getSummariesByTestSumId: jest.fn().mockResolvedValue([entity]),
  getSummaryById: jest.fn().mockResolvedValue(entity),
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockLinearityInjectionService = () => ({
  import: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(linearitySummaryRecord),
  many: jest.fn().mockResolvedValue(linearitySummaryRecords),
});

const mockOfficialRepository = () => ({
  findOne: jest.fn(),
});

describe('LinearitySummaryWorkspaceService', () => {
  let service: LinearitySummaryWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: LinearitySummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearitySummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
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

    service = module.get<LinearitySummaryWorkspaceService>(
      LinearitySummaryWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<LinearitySummaryWorkspaceRepository>(
      LinearitySummaryWorkspaceRepository,
    );
  });

  describe('import', () => {
    it('Should import Linearity Summary', async () => {
      jest
        .spyOn(service, 'createSummary')
        .mockResolvedValue(linearitySummaryRecord);
      const result = await service.import(
        testSumId,
        new LinearitySummaryImportDTO(),
        userId,
      );
      expect(result).toEqual(null);
    });
  });

  describe('getSummariesByTestSumId', () => {
    it('Should return Linearity Summary records by Test Summary id', async () => {
      const result = await service.getSummariesByTestSumId(testSumId);
      expect(result).toEqual(linearitySummaryRecords);
    });
  });

  describe('getSummaryById', () => {
    it('Should return a Linearity Summary record', async () => {
      const result = await service.getSummaryById(id);
      expect(result).toEqual(linearitySummaryRecord);
    });
  });

  describe('createSummary', () => {
    it('Should create and return a new Linearity Summary record', async () => {
      const result = await service.createSummary(testSumId, payload, userId);

      expect(result).toEqual(linearitySummaryRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('editFuelFlowToLoadTest', () => {
    it('Should update and return a new Linearity Summary record', async () => {
      const result = await service.updateSummary(
        testSumId,
        id,
        payload,
        userId,
      );
      expect(result).toEqual(linearitySummaryRecord);
    });
  });

  describe('deleteSummary', () => {
    it('Should delete a Linearity Summary record', async () => {
      const result = await service.deleteSummary(testSumId, id, userId);

      expect(result).toEqual(undefined);
    });
  });
});
