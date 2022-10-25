import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummary } from '../entities/linearity-summary.entity';
import { LinearitySummaryRepository } from '../linearity-summary/linearity-summary.repository';
import { LinearityInjectionDTO, LinearityInjectionImportDTO } from '../dto/linearity-injection.dto';
import {
  LinearitySummaryDTO,
  LinearitySummaryImportDTO,
  LinearitySummaryRecordDTO,
} from '../dto/linearity-summary.dto';
import { LinearityInjectionWorkspaceService } from '../linearity-injection-workspace/linearity-injection.service';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { InternalServerErrorException } from '@nestjs/common';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';

const testSumId = '1';
const linSumId = '1';
const userId = 'testuser';

const lineSummary = new LinearitySummary();
const lineSummaryDto = new LinearitySummaryDTO();
const lineInjectionDto = new LinearityInjectionDTO();
const lineSummaryRecordDto = new LinearitySummaryRecordDTO();
lineInjectionDto.linSumId = linSumId;

const payload = new LinearitySummaryImportDTO();
payload.linearityInjectionData = [new LinearityInjectionImportDTO()];

const mockRepository = () => ({
  getSummaryById: jest.fn().mockResolvedValue(lineSummary),
  getSummariesByTestSumId: jest.fn().mockResolvedValue([lineSummary]),
  find: jest.fn().mockResolvedValue([lineSummary]),
  create: jest.fn().mockResolvedValue(lineSummary),
  save: jest.fn().mockResolvedValue(lineSummary),
  findOne: jest.fn().mockResolvedValue(lineSummary),
  delete: jest.fn().mockResolvedValue(null),
});
const mockOfficialRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new LinearitySummary()),
});

const mockTestSummaryService = () => ({});

const mockLinearityInjectionService = () => ({
  import: jest.fn().mockResolvedValue(null),
  export: jest.fn().mockResolvedValue([lineInjectionDto]),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(lineSummaryDto),
  many: jest.fn().mockResolvedValue([lineSummaryDto]),
});

describe('LinearitySummaryWorkspaceService', () => {
  let service: LinearitySummaryWorkspaceService;
  let repository: LinearitySummaryWorkspaceRepository;

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
        {
          provide: TestSummaryWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn().mockResolvedValue(null),
          }),
        },
      ],
    }).compile();

    service = module.get(LinearitySummaryWorkspaceService);
    repository = module.get(LinearitySummaryWorkspaceRepository);
  });

  describe('getSummaryById', () => {
    it('Should get Linearity Summary', async () => {
      const result = await service.getSummaryById(linSumId);
      expect(result).toEqual(lineSummaryDto);
    });

    it('Should through error while getting a Linearity Summary record', async () => {
      jest.spyOn(repository, 'getSummaryById').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.getSummaryById(linSumId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getSummariesByTestSumId', () => {
    it('Should get Linearity Summaries', async () => {
      const result = await service.getSummariesByTestSumId(testSumId);
      expect(result).toEqual([lineSummaryDto]);
    });
  });

  describe('getSummariesByTestSumIds', () => {
    it('Should get Linearity Summaries', async () => {
      const result = await service.getSummariesByTestSumIds([testSumId]);
      expect(result).toEqual([lineSummaryDto]);
    });
  });

  describe('export', () => {
    it('Should export Linearity Summaries', async () => {
      jest.spyOn(service, 'getSummariesByTestSumIds').mockResolvedValue([]);

      const result = await service.export([testSumId]);
      expect(result).toEqual([]);
    });
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

  describe('createSummary', () => {
    it('Should insert a Linearity Summary record', async () => {
      const result = await service.createSummary(
        testSumId,
        payload,
        userId,
      );
      expect(result).toEqual(lineSummaryDto);
    });
  });

  describe('updateSummary', () => {
    it('Should update a Linearity Summary record', async () => {
      const result = await service.updateSummary(
        testSumId,
        linSumId,
        payload,
        userId,
      );
      expect(result).toEqual(lineSummaryDto);
    });

    it('Should through error while updating a Linearity Summary record', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateSummary(testSumId, linSumId, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteSummary', () => {
    it('Should delete a Linearity Summary record', async () => {
      const result = await service.deleteSummary(testSumId, linSumId, userId);
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Linearity Summary record', async () => {
      const error = new InternalServerErrorException(
        `Error deleting Linearity Summary record Id [${linSumId}]`,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteSummary(testSumId, linSumId, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });
});
