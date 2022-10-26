import { Test } from '@nestjs/testing';
import { AppEHeatInputFromGas } from '../entities/workspace/app-e-heat-input-from-gas.entity';
import { SelectQueryBuilder } from 'typeorm';
import { AppEHeatInputFromGasRepository } from './app-e-heat-input-from-gas.repository';

const appEHeatInputFromGas = new AppEHeatInputFromGas();

const mockQueryBuilder = () => ({
  where: jest.fn(),
  getOne: jest.fn(),
  getMany: jest.fn(),
  leftJoinAndSelect: jest.fn(),
});

describe('AppEHeatInputFromGasRepository', () => {
  let repository;
  let queryBuilder;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AppEHeatInputFromGasRepository,
        { provide: SelectQueryBuilder, useFactory: mockQueryBuilder },
      ],
    }).compile();

    repository = module.get(AppEHeatInputFromGasRepository);
    queryBuilder = module.get<SelectQueryBuilder<AppEHeatInputFromGas>>(
      SelectQueryBuilder,
    );

    repository.createQueryBuilder = jest.fn().mockReturnValue(queryBuilder);
  });

  describe('getAppEHeatInputFromGasById', () => {
    it('calls buildBaseQuery and get one Appendix E Heat Input From Gas from the repository with Id', async () => {
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getOne.mockReturnValue(appEHeatInputFromGas);

      const result = await repository.getAppEHeatInputFromGasById('1');

      expect(result).toEqual(appEHeatInputFromGas);
    });
  });

  describe('getAppEHeatInputFromGasByTestRunId', () => {
    it('calls buildBaseQuery and get one Appendix E Heat Input From Gases from the repository with appECorrTestRunId', async () => {
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([appEHeatInputFromGas]);

      const result = await repository.getAppEHeatInputFromGasByTestRunId('1');

      expect(result).toEqual([appEHeatInputFromGas]);
    });
  });

  describe('getAppEHeatInputFromGasesByTestRunIds', () => {
    it('calls buildBaseQuery and get one Appendix E Heat Input From Gases from the repository with appECorrTestRunIds', async () => {
      queryBuilder.leftJoinAndSelect.mockReturnValue(queryBuilder);
      queryBuilder.where.mockReturnValue(queryBuilder);
      queryBuilder.getMany.mockReturnValue([appEHeatInputFromGas]);

      const result = await repository.getAppEHeatInputFromGasesByTestRunIds([
        '1',
      ]);

      expect(result).toEqual([appEHeatInputFromGas]);
    });
  });
});
