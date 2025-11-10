import { Test, TestingModule } from '@nestjs/testing';

import { FuelFlowmeterAccuracyDTO } from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracy } from '../entities/fuel-flowmeter-accuracy.entity';
import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import { FuelFlowmeterAccuracyRepository } from './fuel-flowmeter-accuracy.repository';
import { FuelFlowmeterAccuracyService } from './fuel-flowmeter-accuracy.service';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const id = '';
const testSumId = '';
const entity = new FuelFlowmeterAccuracy();
const fuelFlowmeterAccuracy = new FuelFlowmeterAccuracyDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(fuelFlowmeterAccuracy),
  many: jest.fn().mockResolvedValue([fuelFlowmeterAccuracy]),
});

describe('FuelFlowmeterAccuracyService', () => {
  let service: FuelFlowmeterAccuracyService;
  let repository: FuelFlowmeterAccuracyRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FuelFlowmeterAccuracyService,
        {
          provide: FuelFlowmeterAccuracyRepository,
          useFactory: mockRepository,
        },
        {
          provide: FuelFlowmeterAccuracyMap,
          useFactory: mockMap,
        },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<FuelFlowmeterAccuracyService>(
      FuelFlowmeterAccuracyService,
    );
    repository = module.get<FuelFlowmeterAccuracyRepository>(
      FuelFlowmeterAccuracyRepository,
    );
  });

  describe('getFuelFlowToLoadTests', () => {
    it('Should return Fuel Flowmeter Accuracy records by Test Summary id', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
        ); 
      const result = await service.getFuelFlowmeterAccuracies(testSumId);

      expect(result).toEqual([fuelFlowmeterAccuracy]);
    });
  });

  describe('getFuelFlowToLoadTest', () => {
    it('Should return a Fuel Flowmeter Accuracy record', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
        );
      const result = await service.getFuelFlowmeterAccuracy(id);

      expect(result).toEqual(fuelFlowmeterAccuracy);
    });

    it('Should throw error when a Fuel Flowmeter Accuracy record not found', async () => {
      
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined)) 
        );
      let errored = false;

      try {
        await service.getFuelFlowmeterAccuracy(id);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('getFuelFlowmeterAccuraciesByTestSumIds', () => {
    it('Should get Fuel Flowmeter Accuracy records by test sum ids', async () => {
      const result = await service.getFuelFlowmeterAccuraciesByTestSumIds([
        testSumId,
      ]);
      expect(result).toEqual([fuelFlowmeterAccuracy]);
    });
  });
  describe('Export', () => {
    it('Should Export Fuel FLowmeter Accuracy', async () => {
      jest
        .spyOn(service, 'getFuelFlowmeterAccuraciesByTestSumIds')
        .mockResolvedValue([]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([]);
    });
  });
});
