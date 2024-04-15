import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { FlowToLoadCheck } from '../entities/workspace/flow-to-load-check.entity';
import { FlowToLoadCheckRepository } from './flow-to-load-check.repository';

const flowToLoadCheck = new FlowToLoadCheck();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
});

describe('FlowToLoadCheckRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        FlowToLoadCheckRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(FlowToLoadCheckRepository);
    queryBuilder = module.get<SelectQueryBuilder<FlowToLoadCheck>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getFlowToLoadChecksByTestSumIds', () => {
    it('calls buildBaseQuery and get one Flow To Load Check from the repository with testSumIds', async () => {
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([flowToLoadCheck]);

      const result = await repository.getFlowToLoadChecksByTestSumIds(['1']);

      expect(result).toEqual([flowToLoadCheck]);
    });
  });
});
