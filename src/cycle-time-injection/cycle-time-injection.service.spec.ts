import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { CycleTimeInjectionDTO } from '../dto/cycle-time-injection.dto';
import { CycleTimeInjection } from '../entities/cycle-time-injection.entity';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';
import { CycleTimeInjectionService } from './cycle-time-injection.service';

const cycleTimeSumId = '1';

const cycleTimeInjection = new CycleTimeInjection();
const cycleTimeInjectionDTO = new CycleTimeInjectionDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([cycleTimeInjection]),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(cycleTimeInjectionDTO),
  many: jest.fn().mockResolvedValue([cycleTimeInjectionDTO]),
});

describe('CycleTimeInjectionService', () => {
  let service: CycleTimeInjectionService;

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
      ],
    }).compile();

    service = module.get<CycleTimeInjectionService>(CycleTimeInjectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
