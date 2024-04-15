import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { TestSummaryMasterDataRelationship } from '../entities/workspace/vw-test-summary-md-relationships.entity';
import { TestSummaryMasterDataRelationshipRepository } from './test-summary-master-data-relationship.repository';

const mockQueryBuilder = () => ({
  distinct: jest.fn(),
  select: jest.fn(),
  where: jest.fn(),
  getMany: jest.fn(),
});

const returnTestSummary = new TestSummaryMasterDataRelationship();

describe('TestSummaryRelationshipsRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        TestSummaryMasterDataRelationshipRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get<TestSummaryMasterDataRelationshipRepository>(
      TestSummaryMasterDataRelationshipRepository,
    );

    queryBuilder = module.get<
      SelectQueryBuilder<TestSummaryMasterDataRelationship>
    >(SelectQueryBuilder);

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.distinct.mockReturnValue(queryBuilder);
    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue([returnTestSummary]);
  });

  it('should return list of test type code', async () => {
    expect(
      await repository.getTestTypeCodesRelationships('LINE', 'testResultCode'),
    ).toEqual([returnTestSummary]);
  });
});
