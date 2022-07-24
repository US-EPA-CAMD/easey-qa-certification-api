import { Test } from '@nestjs/testing';
import { TestSummaryRelationshipsDTO } from '../dto/test-summary-relationships.dto';
import { TestSummaryRelationships } from '../entities/workspace/vw_test_summary_master_data_relationships.entity';
import { SelectQueryBuilder } from 'typeorm';
import { TestSummaryRelationshipsRepository } from './test-summary-relationships.repository';

const mockQueryBuilder = () => ({
  select: jest.fn(),
  getMany: jest.fn(),
});

describe('TestSummaryRelationshipsRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TestSummaryRelationshipsRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get<TestSummaryRelationshipsRepository>(
      TestSummaryRelationshipsRepository,
    );

    queryBuilder = module.get<SelectQueryBuilder<TestSummaryRelationships>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);

    queryBuilder.select.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockReturnValue(TestSummaryRelationshipsDTO);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
