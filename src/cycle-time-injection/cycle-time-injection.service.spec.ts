import { Test, TestingModule } from '@nestjs/testing';

import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { CycleTimeInjection } from '../entities/cycle-time-injection.entity';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';
import { CycleTimeInjectionService } from './cycle-time-injection.service';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const cycleTimeSumId = '1';
const cycleTimeInjId = '1';

const cycleTimeInjection = new CycleTimeInjection();
const cycleTimeInjectionDTO = new CycleTimeInjectionDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([cycleTimeInjection]),
  findOneBy: jest.fn().mockResolvedValue(cycleTimeInjection),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(cycleTimeInjectionDTO),
  many: jest.fn().mockResolvedValue([cycleTimeInjectionDTO]),
});

describe('CycleTimeInjectionService', () => {
  let service: CycleTimeInjectionService;
  let repository: CycleTimeInjectionRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CycleTimeInjectionService,
        {
          provide: CycleTimeInjectionRepository,
          useFactory: mockRepository,
        },
        {
          provide: CycleTimeInjectionMap,
          useFactory: mockMap,
        },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<CycleTimeInjectionService>(CycleTimeInjectionService);
    repository = module.get<CycleTimeInjectionRepository>(
      CycleTimeInjectionRepository,
    );
  });

  describe('getCycleTimeInjections', () => {
    it('should return Cycle Time Injection records by Cycle Time Summary Id', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
        );
      const result = await service.getCycleTimeInjectionsByCycleTimeSumId(
        cycleTimeSumId,
      );

      expect(result).toEqual([cycleTimeInjectionDTO]);
    });
  });

  describe('getCycleTimeInjection', () => {
    it('should return a Cycle Time Summary record', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(mockRepository()) 
        );      
      const result = await service.getCycleTimeInjection(cycleTimeInjId);

      expect(result).toEqual(cycleTimeInjectionDTO);
    });

    it('should throw an error when a Cycle Time Injection record is not found', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined)) 
        );
      let errored = false;

      try {
        await service.getCycleTimeInjection(cycleTimeInjId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('getCycleTimeInjectionByCycleTimeSumIds', () => {
    it('Should get Cycle Time injection records by cycleTimeSumIds', async () => {
      const result = await service.getCycleTimeInjectionByCycleTimeSumIds([
        cycleTimeSumId,
      ]);
      expect(result).toEqual([cycleTimeInjectionDTO]);
    });
  });

  describe('export', () => {
    it('Should export Cycle Time Injection Record', async () => {
      jest
        .spyOn(service, 'getCycleTimeInjectionByCycleTimeSumIds')
        .mockResolvedValue([]);

      const result = await service.export([cycleTimeSumId]);
      expect(result).toEqual([]);
    });
  });
});
