import { Test, TestingModule } from '@nestjs/testing';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryRepository } from './linearity-summary.repository';
import { LinearitySummaryService } from './linearity-summary.service';
import { LinearitySummary } from '../entities/linearity-summary.entity';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { LinearityInjectionService } from '../linearity-injection/linearity-injection.service';
import { LinearityInjectionDTO } from '../dto/linearity-injection.dto';

const linSumId = 'a1b2c3';
const testSumId = 'd4e5f6';
const linearitySummary = new LinearitySummary();
const linearitySummaryDTO = new LinearitySummaryDTO();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(linearitySummaryDTO),
  many: jest.fn().mockResolvedValue([linearitySummaryDTO]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([linearitySummary]),
  findOne: jest.fn().mockResolvedValue(linearitySummary),
});

const mockLinearityInjectionService = () => ({
  export: jest.fn().mockResolvedValue([new LinearityInjectionDTO()]),
});

describe('linearitySummaryService', () => {
  let service: LinearitySummaryService;
  let repository: LinearitySummaryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinearitySummaryService,
        LinearitySummaryMap,
        {
          provide: LinearitySummaryRepository,
          useFactory: mockRepository,
        },
        {
          provide: LinearitySummaryMap,
          useFactory: mockMap,
        },
        {
          provide: LinearityInjectionService,
          useFactory: mockLinearityInjectionService,
        },
      ],
    }).compile();

    service = module.get<LinearitySummaryService>(LinearitySummaryService);
    repository = module.get<LinearitySummaryRepository>(LinearitySummaryRepository);
  });

  describe('getlinearitySummary', () => {
    it('Calls repository.findOne({id}) to get a single Flow Rata Run record', async () => {
      const result = await service.getSummaryById(linSumId);
      expect(result).toEqual(linearitySummaryDTO);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Flow Rata Run record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getSummaryById(linSumId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getlinearitySummarys', () => {
    it('Should return an array of Flow Rata Run records', async () => {
      const result = await service.getSummariesByTestSumId(testSumId);
      expect(result).toEqual([linearitySummary]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getRataSummariesByRataIds', () => {
    it('Should get Rata Travarse records by flow rata run ids', async () => {
      const result = await service.getSummariesByTestSumIds([testSumId]);
      expect(result).toEqual([linearitySummaryDTO]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata Run', async () => {
      jest
        .spyOn(service, 'getSummariesByTestSumIds')
        .mockResolvedValue([linearitySummaryDTO]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([linearitySummaryDTO]);
    });
  });
});
