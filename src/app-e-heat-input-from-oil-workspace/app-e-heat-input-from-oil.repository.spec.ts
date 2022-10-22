import { Test } from '@nestjs/testing';
import { AppEHeatInputFromOil } from '../entities/workspace/app-e-heat-input-from-oil.entity';
import { SelectQueryBuilder } from 'typeorm';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';

const appEHeatInputFromOil = new AppEHeatInputFromOil();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
});

describe('AppEHeatInputFromOilWorkspaceRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AppEHeatInputFromOilWorkspaceRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(AppEHeatInputFromOilWorkspaceRepository);
    queryBuilder = module.get<SelectQueryBuilder<AppEHeatInputFromOil>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getAppEHeatInputFromOilById', () => {
    it('calls buildBaseQuery and get one Appendix E Heat Input From Oil from the repository with Id', async () => {
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(appEHeatInputFromOil);

      const result = await repository.getAppEHeatInputFromOilById('1');

      expect(result).toEqual(appEHeatInputFromOil);
    });
  });

  describe('getAppEHeatInputFromOilsByTestRunId', () => {
    it('calls buildBaseQuery and get one Appendix E Heat Input From oils from the repository with appECorrTestRunId', async () => {
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([appEHeatInputFromOil]);

      const result = await repository.getAppEHeatInputFromOilsByTestRunId('1');

      expect(result).toEqual([appEHeatInputFromOil]);
    });
  });

  describe('getAppEHeatInputFromOilsByTestRunIds', () => {
    it('calls buildBaseQuery and get one Appendix E Heat Input From Oils from the repository with appECorrTestRunIds', async () => {
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([appEHeatInputFromOil]);

      const result = await repository.getAppEHeatInputFromOilsByTestRunIds([
        '1',
      ]);

      expect(result).toEqual([appEHeatInputFromOil]);
    });
  });
});
