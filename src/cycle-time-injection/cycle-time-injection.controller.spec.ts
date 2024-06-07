import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { CycleTimeInjectionController } from './cycle-time-injection.controller';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';
import { CycleTimeInjectionService } from './cycle-time-injection.service';

const locId = '';
const testSumId = '';
const cycleTimeSumId = '';
const cycleTimeInjId = '';
const cycleTimeInjDTO = new CycleTimeInjectionDTO();

const mockService = () => ({
  getCycleTimeInjectionsByCycleTimeSumId: jest
    .fn()
    .mockResolvedValue([cycleTimeInjDTO]),
  getCycleTimeInjection: jest.fn().mockResolvedValue(cycleTimeInjDTO),
});

describe('CycleTimeInjectionController', () => {
  let controller: CycleTimeInjectionController;
  let service: CycleTimeInjectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CycleTimeInjectionController],
      providers: [
        CycleTimeInjectionRepository,
        EntityManager,
        {
          provide: CycleTimeInjectionService,
          useFactory: mockService,
        },
        {
          provide: CycleTimeInjectionMap,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<CycleTimeInjectionController>(
      CycleTimeInjectionController,
    );
    service = module.get<CycleTimeInjectionService>(CycleTimeInjectionService);
  });

  describe('getCycleTimeInjectionsByCycleTimeSumId', () => {
    it('should get Cycle Time Injections by Cycle Time Summary Id', async () => {
      const result = await controller.getCycleTimeInjections(
        locId,
        testSumId,
        cycleTimeSumId,
      );
      expect(result).toEqual([cycleTimeInjDTO]);
    });
  });

  describe('getCycleTimeInjection', () => {
    it('should get Cycle Time Injection record', async () => {
      const result = await controller.getCycleTimeInjection(
        locId,
        testSumId,
        cycleTimeSumId,
        cycleTimeInjId,
      );

      expect(result).toEqual(cycleTimeInjDTO);
    });
  });
});
