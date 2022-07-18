import { Test } from '@nestjs/testing';
import { SelectQueryBuilder } from 'typeorm';
import { LocationWorkspaceRepository } from './location.repository';

const mockQueryBuilder = () => ({
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
  where: jest.fn(),
  getMany: jest.fn(),
});

describe('location repository tests', () => {
  let repository: LocationWorkspaceRepository;
  let queryBuilder: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocationWorkspaceRepository,
        {
          provide: SelectQueryBuilder,
          useFactory: mockQueryBuilder,
        },
      ],
    }).compile();

    repository = module.get(LocationWorkspaceRepository);
    queryBuilder = module.get(SelectQueryBuilder);

    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);
    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.getMany.mockResolvedValue('mockLocation');

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getLocationsByUnitStackPipeIds test', () => {
    it('calls the querybuilder and gets monitor location data', async () => {
      const result = await repository.getLocationsByUnitStackPipeIds(
        1,
        ['1'],
        ['1'],
      );
      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual('mockLocation');
    });
  });
});
