import { Test, TestingModule } from '@nestjs/testing';
import { TestSummary } from '../entities/test-summary.entity';
import { SelectQueryBuilder } from 'typeorm';
import { TestSummaryRepository } from './test-summary.repository';
import { response } from 'express';

jest.mock('../utilities/test-summary.querybuilder');

const testSummary = new TestSummary();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
});

describe('TestSummaryRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TestSummaryRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(TestSummaryRepository);
    queryBuilder = module.get<SelectQueryBuilder<TestSummary>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getTestSummaryById', () => {
    it('calls buildBaseQuery and get one test summary from the repository with Id', async () => {

      repository.buildBaseQuery = jest.fn().mockReturnValue(queryBuilder);

      queryBuilder.where.mockReturnValue(queryBuilder)
      queryBuilder.getOne.mockReturnValue(testSummary)

      const result = await repository.getTestSummaryById('1');

      expect(result).toEqual(testSummary);
    });
  });

  describe('getTestSummaryByLocationId', () => {
    it('get one test summary from the repository with locationId, testTypeCode, testNumber', async () => {

      // repository.buildBaseQuery = jest.fn().mockReturnValue(mockQueryBuilder);
      jest.spyOn(repository, 'buildBaseQuery').mockReturnValue(mockQueryBuilder);
      
      console.log(repository.buildBaseQuery().where())
      queryBuilder.where.mockReturnValue(mockQueryBuilder)
      queryBuilder.getOne.mockReturnValue(testSummary)

      const result = await repository.getTestSummaryByLocationId('1');

      expect(result).toEqual(testSummary);
    });
  });

  describe('getTestSummariesByLocationId', () => {
    it('get one test summary from the repository with locationId, testTypeCode, testNumber', async () => {

    repository.buildBaseQuery = jest.fn().mockReturnValue(queryBuilder);

      queryBuilder.where.mockReturnValue(queryBuilder)
      queryBuilder.getMany.mockReturnValue([testSummary])

      const result = await repository.getTestSummariesByLocationId('1');

      expect(result).toEqual([testSummary]);
    });
  });

})