import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HgInjectionBaseDTO, HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgInjection } from '../entities/hg-injection.entity';
import { HgInjectionMap } from '../maps/hg-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { HgInjectionWorkspaceRepository } from './hg-injection-workspace.repository';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';

const id = '';
const hgTestSumId = '';
const hgTestInjId = '';
const testSumId = '';
const userId = 'user';
const entity = new HgInjection();
const dto = new HgInjectionDTO();

const payload = new HgInjectionBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('HgInjectionWorkspaceService', () => {
  let service: HgInjectionWorkspaceService;
  let repository: HgInjectionWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HgInjectionWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: HgInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: HgInjectionMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<HgInjectionWorkspaceService>(
      HgInjectionWorkspaceService,
    );
    repository = module.get<HgInjectionWorkspaceRepository>(
      HgInjectionWorkspaceRepository,
    );
  });

  describe('getHgInjections', () => {
    it('Should return Hg Injection records by Hg Test Summary id', async () => {
      const result = await service.getHgInjectionsByHgTestSumId(hgTestSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getHgInjection', () => {
    it('Should return a Hg Injection record', async () => {
      const result = await service.getHgInjection(hgTestSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Hg Injection record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getHgInjection(hgTestSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('createHgInjection', () => {
    it('Should create and return a new Hg Injection record', async () => {
      const result = await service.createHgInjection(
        testSumId,
        hgTestSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('Should create and return a new Hg Injection record with Historical Record Id', async () => {
      const result = await service.createHgInjection(
        testSumId,
        hgTestSumId,
        payload,
        userId,
        false,
      );

      expect(result).toEqual(dto);
    });
  });

  describe('updateHgSummary', () => {
    it('Should update and return the Hg Injection record', async () => {
      const result = await service.updateHgInjection(
        testSumId,
        hgTestInjId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Hg Injection record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.updateHgInjection(hgTestSumId, id, payload, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('deleteHgInjection', () => {
    it('should delete an H Injection record', async () => {
      const result = await service.deleteHgInjection(
        testSumId,
        hgTestInjId,
        userId,
      );

      expect(result).toEqual(undefined);
    });

    it('should throw an error while deleting a Hg Injection record', async () => {
      const error = new InternalServerErrorException(
        `Error deleting Cycle Time Injection record Id [${hgTestInjId}]`,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;

      try {
        await service.deleteHgInjection(testSumId, hgTestInjId, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('getHgInjectionsByHgSumIds', () => {
    it('Should get Hg Injection records by Hg Summary Ids', async () => {
      const result = await service.getHgInjectionsByHgSumIds([hgTestSumId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export Hg Injection record', async () => {
      jest.spyOn(service, 'getHgInjectionsByHgSumIds').mockResolvedValue([]);

      const result = await service.export([hgTestSumId]);
      expect(result).toEqual([]);
    });
  });
});
