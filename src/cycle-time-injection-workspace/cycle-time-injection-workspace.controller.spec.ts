import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionWorkspaceController } from './cycle-time-injection-workspace.controller';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeInjectionWorkspaceService } from './cycle-time-injection-workspace.service';
import {CycleTimeInjectionChecksService} from "./cycle-time-injection-checks.service";

const locId = '';
const testSumId = '';
const cycleTimeSumId = '';
const cycleTimeInjId = '';
const cycleTimeInjDTO = new CycleTimeInjectionDTO();

const payload: CycleTimeInjectionBaseDTO = {
  gasLevelCode: 'ZERO',
  calibrationGasValue: 0.0,
  beginDate: new Date('2016-08-01'),
  beginHour: 10,
  beginMinute: 50,
  endDate: new Date('2016-08-01'),
  endHour: 14,
  endMinute: 52,
  injectionCycleTime: 2,
  beginMonitorValue: 12.53,
  endMonitorValue: 0.0,
};

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
};

const mockService = () => ({
  getCycleTimeInjectionsByCycleTimeSumId: jest
    .fn()
    .mockResolvedValue([cycleTimeInjDTO]),
  getCycleTimeInjection: jest.fn().mockResolvedValue(cycleTimeInjDTO),
  createCycleTimeInjection: jest.fn().mockResolvedValue(cycleTimeInjDTO),
  updateCycleTimeInjection: jest.fn().mockResolvedValue(cycleTimeInjDTO),
  deleteCycleTimeInjection: jest.fn().mockResolvedValue(null),
});

const mockChecksService = () => ({
  runChecks: jest.fn(),
});

describe('CycleTimeInjectionWorkspaceController', () => {
  let controller: CycleTimeInjectionWorkspaceController;
  let service: CycleTimeInjectionWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CycleTimeInjectionWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        CycleTimeInjectionWorkspaceRepository,
        {
          provide: CycleTimeInjectionWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: CycleTimeInjectionChecksService,
          useFactory: mockChecksService,
        },
      ],
    }).compile();

    controller = module.get<CycleTimeInjectionWorkspaceController>(
      CycleTimeInjectionWorkspaceController,
    );
    service = module.get<CycleTimeInjectionWorkspaceService>(
      CycleTimeInjectionWorkspaceService,
    );
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

  describe('createLinearityInjection', () => {
    it('should create Linearity injection record', async () => {
      const result = await controller.createCycleTimeInjection(
        locId,
        testSumId,
        cycleTimeSumId,
        payload,
        user,
      );
      expect(result).toEqual(cycleTimeInjDTO);
    });
  });

  describe('updateCycleTimeInjection', () => {
    it('should update Cycle Time Injection record', async () => {
      const result = await controller.updateCycleTimeInjection(
        locId,
        testSumId,
        cycleTimeSumId,
        cycleTimeInjId,
        payload,
        user,
      );

      expect(result).toEqual(cycleTimeInjDTO);
    });
  });

  describe('deleteCycleTimeInjection', () => {
    it('should delete Cycle Time Injection record', async () => {
      const result = await controller.deleteCycleTimeInjection(
        locId,
        testSumId,
        cycleTimeSumId,
        cycleTimeInjId,
        user,
      );

      expect(result).toEqual(null);
    });
  });
});
