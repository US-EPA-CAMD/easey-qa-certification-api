import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { TestSummaryBaseDTO } from '../dto/test-summary.dto';
import { AnalyzerRange } from '../entities/workspace/analyzerRange.entity';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';

const analyzerRange = new AnalyzerRange();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getMany: jest.fn(),
});

describe('AppEHeatInputFromOilWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnalyzerRangeWorkspaceRepository,
        EntityManager,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(AnalyzerRangeWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<AnalyzerRange>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getAnalyzerRangeByComponentIdAndDate', () => {
    it('calls buildBaseQuery and get Many Analyzer Ranges from the repository', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([analyzerRange]);

      const result = await repository.getAnalyzerRangeByComponentIdAndDate(
        'componentRecordId',
        new TestSummaryBaseDTO(),
      );

      expect(result).toEqual([analyzerRange]);
    });
  });
});
