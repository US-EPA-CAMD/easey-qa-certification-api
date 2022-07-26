import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { TestSummaryMasterDataRelationshipRepository } from './test-summary-master-data-relationship.repository';
import { TestSummaryMasterDataRelationship } from '../entities/workspace/vw-test-summary-md-relationships.entity';

const mockQueryBuilder = () => ({
  select: jest.fn(),
  getMany: jest.fn(),
});

const returnTestSummary = new TestSummaryMasterDataRelationship();

describe('TestSummaryRelationshipsRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
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

    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue([returnTestSummary]);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
