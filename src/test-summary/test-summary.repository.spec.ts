import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder, DataSource } from 'typeorm';

import { TestSummary } from '../entities/test-summary.entity';
import { TestSummaryRepository } from './test-summary.repository';

import * as testSummaryQueryBuilder from '../utilities/test-summary.querybuilder';
import { withSlaveConnection } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');
const testSummary = new TestSummary();

const mockQueryBuilder = {
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
};

const mockManager = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
};

describe('TestSummaryRepository', () => {
  let repository;
  let queryBuilder;
  let dataSource: DataSource;

  beforeEach(async () => {
    
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        TestSummaryRepository,
        { provide: SelectQueryBuilder, useFactory: () => mockQueryBuilder },
        {provide: DataSource, useValue: dataSource },      
      ],
    }).compile();

    repository = module.get(TestSummaryRepository);
    queryBuilder = module.get<SelectQueryBuilder<TestSummary>>(
      SelectQueryBuilder,
    );

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

      (withSlaveConnection as jest.Mock).mockImplementation(
          async (_dataSource, callback) =>
      callback(mockManager))
  });

  describe('getTestSummaryById', () => {
    it('calls buildBaseQuery and get one test summary from the repository with Id', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(testSummary);

      const result = await repository.getTestSummaryById('1');

      expect(result).toEqual(testSummary);
    });
  });

  describe('getTestSummaryByLocationId', () => {
    it('get one test summary from the repository with locationId, testTypeCode, testNumber', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);

      queryBuilder.getOne.mockReturnValue(testSummary);

      const result = await repository.getTestSummaryByLocationId('1');

      expect(result).toEqual(testSummary);
    });
  });

  describe('getTestSummariesByLocationId', () => {
    it('get many test summary from the repository with locationId, testTypeCode, beginDate and endDate', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([testSummary]);

      const result = await repository.getTestSummariesByLocationId('1');

      expect(result).toEqual([testSummary]);
    });
  });

  describe('getTestSummariesByUnitStack', () => {
    it('get one test summary from the repository with facilityId', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([testSummary]);

      const result = await repository.getTestSummariesByUnitStack('1');

      expect(result).toEqual([testSummary]);
    });

    it('get one test summary from the repository with facilityId, unitids, stackPipeIds', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([testSummary]);

      const result = await repository.getTestSummariesByUnitStack(
        '1',
        ['1'],
        ['1'],
      );

      expect(result).toEqual([testSummary]);
    });
  });
});