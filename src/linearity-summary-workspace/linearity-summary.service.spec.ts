import {InternalServerErrorException} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {LoggerModule} from '@us-epa-camd/easey-common/logger';
import {EntityManager} from 'typeorm';

import {
  LinearityInjectionDTO,
  LinearityInjectionImportDTO,
} from '../dto/linearity-injection.dto';
import {
  LinearitySummaryDTO,
  LinearitySummaryImportDTO,
  LinearitySummaryRecordDTO,
} from '../dto/linearity-summary.dto';
import {LinearitySummary} from '../entities/linearity-summary.entity';
import {LinearityInjectionWorkspaceService} from '../linearity-injection-workspace/linearity-injection.service';
import {LinearitySummaryRepository} from '../linearity-summary/linearity-summary.repository';
import {LinearitySummaryMap} from '../maps/linearity-summary.map';
import {TestSummaryWorkspaceService} from '../test-summary-workspace/test-summary.service';
import {LinearitySummaryWorkspaceRepository} from './linearity-summary.repository';
import {LinearitySummaryWorkspaceService} from './linearity-summary.service';

const id = '';
const testSumId = '1';
const linSumId = '1';
const userId = 'testuser';
const linearitySummaryRecord = new LinearitySummaryDTO();
const linearitySummaryRecords = [linearitySummaryRecord];

const lineSummary = new LinearitySummary();
const lineSummaryDto = new LinearitySummaryDTO();
const lineInjectionDto = new LinearityInjectionDTO();
const lineSummaryRecordDto = new LinearitySummaryRecordDTO();
lineInjectionDto.linSumId = linSumId;

const payload = new LinearitySummaryImportDTO();

const mockRepository = () => ({
  getSummaryById: jest.fn().mockResolvedValue(lineSummary),
  getSummariesByTestSumId: jest.fn().mockResolvedValue([lineSummary]),
  find: jest.fn().mockResolvedValue([lineSummary]),
  create: jest.fn().mockResolvedValue(lineSummary),
  save: jest.fn().mockResolvedValue(lineSummary),
  findOneBy: jest.fn().mockResolvedValue(lineSummary),
  delete: jest.fn().mockResolvedValue(null),
});

const historicalLinSum = new LinearitySummary();
historicalLinSum.id = 'HISTORICAL-ID';

const mockOfficialRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(historicalLinSum),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockLinearityInjectionService = () => ({
  import: jest.fn().mockResolvedValue(null),
  export: jest.fn().mockResolvedValue([lineInjectionDto]),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(linearitySummaryRecord),
  many: jest.fn().mockResolvedValue(linearitySummaryRecords),
});

describe('LinearitySummaryWorkspaceService', () => {
  let service: LinearitySummaryWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let linearityInjectionService: LinearityInjectionWorkspaceService;
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
        {
          provide: TestSummaryWorkspaceService,
          useFactory: () => ({
            resetToNeedsEvaluation: jest.fn().mockResolvedValue(null),
          }),
        },
      ],
    }).compile();

    service = module.get<LinearitySummaryWorkspaceService>(
      LinearitySummaryWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    linearityInjectionService = module.get<LinearityInjectionWorkspaceService>(
      LinearityInjectionWorkspaceService,
    );
    repository = module.get<LinearitySummaryWorkspaceRepository>(
      LinearitySummaryWorkspaceRepository,
    );
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
      jest
        .spyOn(service, 'getSummariesByTestSumIds')
        .mockResolvedValue([lineSummaryDto]);

      const result = await service.export([testSumId]);
      expect(result).toEqual([lineSummaryDto]);
    });
  });

  describe('import', () => {
    const importPayload = payload;
    importPayload.gasLevelCode = 'CODE';

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

    it('Should import Linearity Summary when its a historical recored', async () => {
      jest
        .spyOn(service, 'createSummary')
        .mockResolvedValue(lineSummaryRecordDto);
      importPayload.linearityInjectionData = [
        new LinearityInjectionImportDTO(),
      ];

      const result = await service.import(
        testSumId,
        importPayload,
        userId,
        true,
      );
      expect(result).toEqual(null);
    });

    it('Should import Linearity Summary with transaction', async () => {
      // Create a spy on createSummary that returns the expected value
      const createSummarySpy = jest
        .spyOn(service, 'createSummary')
        .mockResolvedValue(linearitySummaryRecord);

      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      // Call import with transaction
      await service.import(
        testSumId,
        new LinearitySummaryImportDTO(),
        userId,
        false,
        mockTrx,
      );

      // Verify createSummary was called with transaction
      expect(createSummarySpy).toHaveBeenCalledWith(
        testSumId,
        expect.any(Object),
        userId,
        true,
        null,
        mockTrx,
      );
    });
  });

  describe('createSummary', () => {
    it('Should insert a Linearity Summary record', async () => {
      const result = await service.createSummary(testSumId, payload, userId);
      expect(result).toEqual(linearitySummaryRecord);
    });

    it('Should insert a Linearity Summary record with historical Id', async () => {
      const result = await service.createSummary(
        testSumId,
        payload,
        userId,
        true,
        'HISTORICAL-ID',
      );
      expect(result).toEqual(linearitySummaryRecord);
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
      expect(result).toEqual(linearitySummaryRecord);
    });

    it('Should through error while updating a Linearity Summary record', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

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

  describe('Transaction Support', () => {
    it('Should use transaction entity manager when provided', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue(lineSummary),
          save: jest.fn().mockResolvedValue(lineSummary),
          findOneBy: jest.fn().mockResolvedValue(lineSummary),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call createSummary with transaction
      await service.createSummary(
        testSumId,
        payload,
        userId,
        false,
        'HISTORICAL-ID',
        mockTrx,
      );

      // Verify transaction was used
      expect(mockTrx.getRepository).toHaveBeenCalled();

      // Verify transaction was passed to child services
      expect(resetSpy).toHaveBeenCalledWith(
        testSumId,
        userId,
        expect.any(Boolean),
        mockTrx,
      );
    });

    it('Should pass transaction to child services during import', async () => {
      // Mock transaction for entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      // Create a spy on createSummary that returns a known value with ID
      const mockSummary = new LinearitySummaryRecordDTO();
      mockSummary.id = 'test-summary-id';
      jest.spyOn(service, 'createSummary').mockResolvedValue(mockSummary);

      // Spy on linearityInjectionService.import
      const injectionImportSpy = jest.spyOn(linearityInjectionService, 'import');

      // Create payload with injection data only
      const importPayloadWithInjections = new LinearitySummaryImportDTO();
      importPayloadWithInjections.linearityInjectionData = [
        new LinearityInjectionImportDTO(),
      ];

      // Call import with transaction
      await service.import(
        testSumId,
        importPayloadWithInjections,
        userId,
        false,
        mockTrx,
      );

      // Verify transaction was passed to child service with the correct parameters per requirement
      expect(injectionImportSpy).toHaveBeenCalledWith(
        testSumId,
        mockSummary.id,
        expect.any(Object),
        userId,
        false,
        mockTrx,
      );
    });
  });
});
