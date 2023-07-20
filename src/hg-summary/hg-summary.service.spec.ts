import { Test, TestingModule } from '@nestjs/testing';
import { HgInjectionDTO } from '../dto/hg-injection.dto';
import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummary } from '../entities/hg-summary.entity';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { HgSummaryRepository } from './hg-summary.repository';
import { HgSummaryService } from './hg-summary.service';
import { HgInjectionService } from '../hg-injection/hg-injection.service';
import { ConfigService } from '@nestjs/config';

const id = '';
const testSumId = '';
const entity = new HgSummary();
const dto = new HgSummaryDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockHgInjectionService = () => ({
  import: jest.fn().mockResolvedValue(null),
  export: jest.fn().mockResolvedValue([dto]),
});

describe('HgSummaryService', () => {
  let service: HgSummaryService;
  let repository: HgSummaryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        HgSummaryService,
        {
          provide: HgSummaryRepository,
          useFactory: mockRepository,
        },
        {
          provide: HgSummaryMap,
          useFactory: mockMap,
        },
        {
          provide: HgInjectionService,
          useFactory: mockHgInjectionService,
        },
      ],
    }).compile();

    service = module.get<HgSummaryService>(HgSummaryService);
    repository = module.get<HgSummaryRepository>(HgSummaryRepository);
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
});
