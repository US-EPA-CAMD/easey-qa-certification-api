import { Test, TestingModule } from '@nestjs/testing';
import { HgSummaryBaseDTO, HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummary } from '../entities/workspace/hg-summary.entity';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { HgSummaryWorkspaceRepository } from './hg-summary-workspace.repository';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';

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

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('HgSummaryWorkspaceService', () => {
  let service: HgSummaryWorkspaceService;
  let repository: HgSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
});
