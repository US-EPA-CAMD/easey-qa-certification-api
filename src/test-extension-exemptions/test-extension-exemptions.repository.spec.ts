import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { TestExtensionExemption } from '../entities/test-extension-exemption.entity';
import * as testExtExpQueryBuilder from '../utilities/test-extension-exemption.querybuilder';
import { TestExtensionExemptionsRepository } from './test-extension-exemptions.repository';

const testExtExp = new TestExtensionExemption();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
});

describe('TestExtensionExemptionsRepository', () => {
  let repository: TestExtensionExemptionsRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EntityManager,
        TestExtensionExemptionsRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get<TestExtensionExemptionsRepository>(
      TestExtensionExemptionsRepository,
    );
    queryBuilder = module.get<SelectQueryBuilder<TestExtensionExemption>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
    jest
      .spyOn(testExtExpQueryBuilder, 'addJoins')
      .mockReturnValue(queryBuilder);
  });

  describe('getTestExtensionExemptionById', () => {
    it('calls buildBaseQuery and get one Test Extension Exemption from the repository with Id', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(testExtExp);

      const result = await repository.getTestExtensionExemptionById('1');

      expect(result).toEqual(testExtExp);
    });
  });

  describe('getTestExtensionExemptionsByLocationId', () => {
    it('get many test Extension Exemption from the repository with locationId, testTypeCode, beginDate and endDate', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([testExtExp]);

      const result = await repository.getTestExtensionExemptionsByLocationId(
        '1',
      );

      expect(result).toEqual([testExtExp]);
    });
  });

  describe('getTestExtensionExemptionsByUnitStack', () => {
    it('get one test extension exemption record from the repository with facilityId', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([testExtExp]);

      const result = await repository.getTestExtensionsByUnitStack(1);

      expect(result).toEqual([testExtExp]);
    });

    it('get one test extension exemption from the repository with facilityId, unitids, stackPipeIds', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([testExtExp]);

      const result = await repository.getTestExtensionsByUnitStack(
        1,
        ['1'],
        ['1'],
      );

      expect(result).toEqual([testExtExp]);
    });
  });
});
