import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { TestSummary } from '../entities/test-summary.entity';
import { TestSummaryRepository } from './test-summary.repository';

import * as testSummaryQueryBuilder from '../utilities/test-summary.querybuilder';

const testSummary = new TestSummary();

const queryBuilder: jest.Mocked<SelectQueryBuilder<TestSummary>> = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
} as any;

describe('TestSummaryRepository', () => {
  let repository;
  let mockEntityManager;
  let mockSlaveManager;
  let mockQueryRunner;

  beforeEach(async () => {
    mockSlaveManager = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
    };

    mockQueryRunner = {
      manager: mockSlaveManager,
    };

    mockEntityManager = {
      connection: {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        { provide: EntityManager, useValue: mockEntityManager },
        TestSummaryRepository,
      ],
    }).compile();

    repository = module.get(TestSummaryRepository);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    jest
      .spyOn(testSummaryQueryBuilder, 'addJoins')
      .mockReturnValue(queryBuilder);
    jest
      .spyOn(testSummaryQueryBuilder, 'addTestTypeWhere')
      .mockReturnValue(queryBuilder);
    jest
      .spyOn(testSummaryQueryBuilder, 'addTestNumberWhere')
      .mockReturnValue(queryBuilder);
    jest
      .spyOn(testSummaryQueryBuilder, 'addBeginAndEndDateWhere')
      .mockReturnValue(queryBuilder);
  });

  describe('getTestSummaryById', () => {
    it('calls buildBaseQuery and get one test summary from the repository with Id', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(Promise.resolve(testSummary));

      const result = await repository.getTestSummaryById('1');

      expect(result).toEqual(testSummary);
    });
  });

  describe('getTestSummaryByLocationId', () => {
    it('get one test summary from the repository with locationId, testTypeCode, testNumber', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);

      queryBuilder.getOne.mockReturnValue(Promise.resolve(testSummary));

      const result = await repository.getTestSummaryByLocationId('1');

      expect(result).toEqual(testSummary);
    });
  });

  describe('getTestSummariesByLocationId', () => {
    it('get many test summary from the repository with locationId, testTypeCode, beginDate and endDate', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue(Promise.resolve([testSummary]));

      const result = await repository.getTestSummariesByLocationId('1');

      expect(result).toEqual([testSummary]);
    });
  });

  describe('getTestSummariesByUnitStack', () => {
    it('get one test summary from the repository with facilityId', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue(Promise.resolve([testSummary]));

      const result = await repository.getTestSummariesByUnitStack('1');

      expect(result).toEqual([testSummary]);
    });

    it('get one test summary from the repository with facilityId, unitids, stackPipeIds', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue(Promise.resolve([testSummary]));

      const result = await repository.getTestSummariesByUnitStack(
        '1',
        ['1'],
        ['1'],
      );

      expect(result).toEqual([testSummary]);
    });
  });
});
