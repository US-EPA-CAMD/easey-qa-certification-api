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
  roles: [],
};

const mockService = () => ({
  createCycleTimeInjection: jest.fn().mockResolvedValue(cycleTimeInjDTO),
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
      ],
    }).compile();

    controller = module.get<CycleTimeInjectionWorkspaceController>(
      CycleTimeInjectionWorkspaceController,
    );
    service = module.get<CycleTimeInjectionWorkspaceService>(
      CycleTimeInjectionWorkspaceService,
    );
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
});
