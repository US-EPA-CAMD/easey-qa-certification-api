import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { HgSummaryRepository } from '../hg-summary/hg-summary.repository';
import { HgSummaryBaseDTO, HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummary } from '../entities/workspace/hg-summary.entity';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { HgSummaryWorkspaceRepository } from './hg-summary-workspace.repository';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';
import { HgInjectionWorkspaceService } from '../hg-injection-workspace/hg-injection-workspace.service';

const id = '';
const testSumId = '';
const userId = 'user';
const entity = new HgSummary();
const dto = new HgSummaryDTO();

const payload = new HgSummaryBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockHistoricalRepo = () => ({
  findOne: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockHgInjectionWorkspaceService = () => ({
  import: jest.fn().mockResolvedValue(null),
  export: jest.fn().mockResolvedValue([dto]),
});

describe('HgSummaryWorkspaceService', () => {
  let service: HgSummaryWorkspaceService;
  let repository: HgSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        HgSummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: HgSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: HgSummaryMap,
          useFactory: mockMap,
        },
        {
<<<<<<< HEAD
          provide: HgSummaryRepository,
          useFactory: mockHistoricalRepo,
=======
          provide: HgInjectionWorkspaceService,
          useFactory: mockHgInjectionWorkspaceService,
>>>>>>> 205cdc843c569c35f02bf73a94ae190eaf10afcc
        },
      ],
    }).compile();

    service = module.get<HgSummaryWorkspaceService>(HgSummaryWorkspaceService);
    repository = module.get<HgSummaryWorkspaceRepository>(
      HgSummaryWorkspaceRepository,
    );
  });

  describe('getHgSummaries', () => {
    it('Should return Hg Summary records by Test Summary id', async () => {
      const result = await service.getHgSummaries(testSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getHgSummary', () => {
    it('Should return a Hg Summary record', async () => {
      const result = await service.getHgSummary(id, testSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Hg Summary record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getHgSummary(id, testSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('createHgSummary', () => {
    it('Should create and return a new Hg Summary record', async () => {
      const result = await service.createHgSummary(testSumId, payload, userId);

      expect(result).toEqual(dto);
    });

    it('Should create and return a new Hg Summary record with Historical Record Id', async () => {
      const result = await service.createHgSummary(
        testSumId,
        payload,
        userId,
        false,
        'historicalId',
      );

      expect(result).toEqual(dto);
    });
  });

  describe('getHgSummaryByTestSumIds', () => {
    it('Should get Hg Summary records by test sum ids', async () => {
      const result = await service.getHgSummaryByTestSumIds([testSumId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export Hg Summary Record', async () => {
      jest.spyOn(service, 'getHgSummaryByTestSumIds').mockResolvedValue([]);

      const result = await service.export([testSumId]);
      expect(result).toEqual([]);
    });
  });

  describe('updateHgSummary', () => {
    it('Should update and return the Hg Summary record', async () => {
      const result = await service.updateHgSummary(
        testSumId,
        id,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Hg Summary record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.updateHgSummary(testSumId, id, payload, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('deleteHgSummary', () => {
    it('Should delete a Hg Summary record', async () => {
      const result = await service.deleteHgSummary(testSumId, id, userId);

      expect(result).toEqual(undefined);
    });

    it('Should throw error when database throws an error while deleting a Hg Summary record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteHgSummary(testSumId, id, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('import', () => {
    const importDTO = new HgSummaryDTO();
    it('should Import Hg Summary Data', async () => {
      jest.spyOn(service, 'createHgSummary').mockResolvedValue(dto);

      await service.import(testSumId, importDTO, userId, false);
    });

    it('Should Import Hg Summary Data from Historical Record', async () => {
      jest.spyOn(service, 'createHgSummary').mockResolvedValue(dto);

      await service.import(testSumId, importDTO, userId, true);
    });
  });
});
