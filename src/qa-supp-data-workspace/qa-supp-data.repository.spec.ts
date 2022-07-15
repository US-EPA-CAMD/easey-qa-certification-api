import { Test } from '@nestjs/testing';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { SelectQueryBuilder } from 'typeorm';
import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';

const locationId = '1';
const testTypeCode = '1';
const testNumber = '1';

const qaSuppData = new QASuppData();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  andWhere: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  innerJoinAndSelect: jest.fn(),
  leftJoinAndSelect: jest.fn(),
  leftJoin: jest.fn(),
});

describe('QASuppDataWorkspaceRepository', () => {
  let repository: QASuppDataWorkspaceRepository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QASuppDataWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(QASuppDataWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<QASuppData>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  /* describe('getQASuppDataByLocationId', () => {
    it('calls buildBaseQuery and get a QA Support Data from the repository using LocationId, testTypeCode, TestNumber', async () => {
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.andWhere.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(qaSuppData);

      const result = await repository.getQASuppDataByLocationId(
        locationId,
        testTypeCode,
        testNumber,
      );

      expect(result).toEqual(qaSuppData);
    });
  }); */
});
