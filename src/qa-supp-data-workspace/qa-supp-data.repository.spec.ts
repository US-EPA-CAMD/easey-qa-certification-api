import { Test } from '@nestjs/testing';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { SelectQueryBuilder } from 'typeorm';
import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';

const locationId = '1';
const componentID = '1';
const testTypeCode = '1';
const testNumber = '1';
const spanScaleCode = '1';
const endDate = new Date();
const endHour = 1;
const endMinute = 1;

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
    queryBuilder.innerJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
    queryBuilder.leftJoin.mockReturnValue(queryBuilder);

    queryBuilder.where.mockReturnValue(queryBuilder);
    queryBuilder.andWhere.mockReturnValue(queryBuilder);
    queryBuilder.getOne.mockReturnValue(qaSuppData);
  });

  describe('getQASuppDataByLocationId', () => {
    it('calls buildBaseQuery and get a QA Support Data from the repository using LocationId, testTypeCode, TestNumber', async () => {
      const result = await repository.getQASuppDataByLocationId(
        locationId,
        testTypeCode,
        testNumber,
      );

      expect(result).toEqual(qaSuppData);
    });
  });

  describe('getQASuppDataByTestTypeCodeComponentIdEndDateEndTime', () => {
    it('calls buildBaseQuery and get a QA Support Data from the repository using LocationId, componentID, testTypeCode, TestNumber, spanScaleCode, endDate and endTime', async () => {
      const result = await repository.getQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
        locationId,
        componentID,
        testTypeCode,
        testNumber,
        spanScaleCode,
        endDate,
        endHour,
        endMinute,
      );

      expect(result).toEqual(qaSuppData);
    });
  });
});
