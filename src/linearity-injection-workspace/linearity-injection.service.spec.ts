import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import {
  LinearityInjectionDTO,
  LinearityInjectionImportDTO,
  LinearityInjectionRecordDTO,
} from '../dto/linearity-injection.dto';
import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';
import { LinearityInjectionRepository } from '../linearity-injection/linearity-injection.repository';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';

const testSumId = '1';
const linSumId = '1';
const linInjId = '1';
const userId = 'testuser';

const lineInjection = new LinearityInjection();
const lineInjectionDto = new LinearityInjectionDTO();
const lineInjectionRecordDto = new LinearityInjectionRecordDTO();

const payload = new LinearityInjectionImportDTO();

const mockRepository = () => ({
  findBy: jest.fn().mockResolvedValue([lineInjection]),
  create: jest.fn().mockResolvedValue(lineInjection),
  save: jest.fn().mockResolvedValue(lineInjection),
  findOneBy: jest.fn().mockResolvedValue(lineInjection),
  delete: jest.fn().mockResolvedValue(null),
});

const mockOfficialRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(new LinearityInjection()),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(lineInjectionDto),
  many: jest.fn().mockResolvedValue([lineInjectionDto]),
});

describe('LinearityInjectionWorkspaceService', () => {
  let service: LinearityInjectionWorkspaceService;
  let repository: LinearityInjectionWorkspaceRepository;
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
          provide: LinearityInjectionRepository,
          useFactory: mockOfficialRepository,
        },
        {
          provide: LinearityInjectionMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get(LinearityInjectionWorkspaceService);
    repository = module.get(LinearityInjectionWorkspaceRepository);
    testSummaryService = module.get(TestSummaryWorkspaceService);
  });

  describe('getInjectionById', () => {
    it('Should get Linearity Injection', async () => {
      const result = await service.getInjectionById(linInjId);
      expect(result).toEqual(lineInjectionDto);
    });

    it('Should through error while getting a Linearity Injection record', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.getInjectionById(linInjId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getInjectionsByLinSumId', () => {
    it('Should get Linearity Injections', async () => {
      const result = await service.getInjectionsByLinSumId(linSumId);
      expect(result).toEqual([lineInjectionDto]);
    });
  });

  describe('getInjectionsByLinSumIds', () => {
    it('Should get Linearity Injections', async () => {
      const result = await service.getInjectionsByLinSumIds([linSumId]);
      expect(result).toEqual([lineInjectionDto]);
    });
  });

  describe('export', () => {
    it('Should export Linearity Injections', async () => {
      jest.spyOn(service, 'getInjectionsByLinSumIds').mockResolvedValue([]);

      const result = await service.export([linSumId]);
      expect(result).toEqual([]);
    });
  });

  describe('import', () => {
    it('Should import Linearity Injection', async () => {
      jest
          .spyOn(service, 'createInjection')
          .mockResolvedValue(lineInjectionRecordDto);
      const result = await service.import(testSumId, linSumId, payload, userId);
      expect(result).toEqual(null);
    });

    it('Should import Linearity Injection with transaction', async () => {
      // Create a spy on createInjection that returns the expected value
      const createInjectionSpy = jest
        .spyOn(service, 'createInjection')
        .mockResolvedValue(lineInjectionRecordDto);

      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue(repository),
      } as unknown as EntityManager;

      await service.import(testSumId, linSumId, payload, userId, false, mockTrx);

      // Verify createInjection was called with transaction
      expect(createInjectionSpy).toHaveBeenCalledWith(
          testSumId,
          linSumId,
          expect.any(Object),
          userId,
        true, // isImport is always true in the import method
        null, // historicalRecordId is null when not a historical record
          mockTrx,
      );
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

    it('Should through error while updating a Linearity Injection record', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateInjection(testSumId, linInjId, payload, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteInjection', () => {
    it('Should delete a Linearity Injection record', async () => {
      const result = await service.deleteInjection(testSumId, linInjId, userId);
      expect(result).toEqual(undefined);
    });

    it('Should throw error while deleting a Linearity Injection record', async () => {
      const error = new InternalServerErrorException(
          `Error deleting Linearity Injection record Id [${linInjId}]`,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteInjection(testSumId, linInjId, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('Transaction Support', () => {
    it('Should use transaction entity manager when provided', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue(lineInjection),
          save: jest.fn().mockResolvedValue(lineInjection),
          findOneBy: jest.fn().mockResolvedValue(lineInjection),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call createInjection with transaction
      await service.createInjection(
          testSumId,
          linSumId,
          payload,
          userId,
          false,
          null,
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

    it('Should use transaction entity manager for update operations', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          findOneBy: jest.fn().mockResolvedValue(lineInjection),
          save: jest.fn().mockResolvedValue(lineInjection),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call updateInjection with transaction
      await service.updateInjection(
          testSumId,
          linInjId,
          payload,
          userId,
          false,
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

    it('Should use transaction entity manager for delete operations', async () => {
      // Mock transaction entity manager
      const mockTrx = {
        getRepository: jest.fn().mockReturnValue({
          delete: jest.fn().mockResolvedValue(null),
        }),
      } as unknown as EntityManager;

      // Spy on testSummaryService.resetToNeedsEvaluation
      const resetSpy = jest.spyOn(testSummaryService, 'resetToNeedsEvaluation');

      // Call deleteInjection with transaction
      await service.deleteInjection(
          testSumId,
          linInjId,
          userId,
          false,
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
  });
});
