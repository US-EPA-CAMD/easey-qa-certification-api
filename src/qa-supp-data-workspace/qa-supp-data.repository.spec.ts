import { Test } from '@nestjs/testing';
import { EntityManager, SelectQueryBuilder } from 'typeorm';

import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';

const locationId = '1';
const testSumId = '1';
const monSysID = '1';
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
        EntityManager,
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

  describe('getUnassociatedQASuppDataByLocationIdAndTestSum', () => {
    it('calls buildBaseQuery and get a QA Support Data from the repository using LocationId, testTypeCode, TestNumber', async () => {
      const result = await repository.getUnassociatedQASuppDataByLocationIdAndTestSum(
        locationId,
        testSumId,
        testTypeCode,
        testNumber,
      );

      expect(result).toEqual(qaSuppData);
    });
  });

  describe('getUnassociatedQASuppDataByTestTypeCodeComponentIdEndDateEndTime', () => {
    it('calls buildBaseQuery and get a QA Support Data from the repository using LocationId, componentID, testTypeCode, TestNumber, spanScaleCode, endDate and endTime', async () => {
      const result = await repository.getUnassociatedQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
        locationId,
        monSysID,
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

  describe('getQASuppDataByTestTypeCodeComponentIdEndDateEndTime', () => {
    it('calls buildBaseQuery and get a QA Support Data from the repository using LocationId, componentID, testTypeCode, TestNumber, spanScaleCode, endDate and endTime', async () => {
      const result = await repository.getQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
        locationId,
        monSysID,
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
