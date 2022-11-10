import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  CycleTimeSummaryBaseDTO,
  CycleTimeSummaryDTO,
} from '../dto/cycle-time-summary.dto';
import { CycleTimeSummaryWorkspaceController } from './cycle-time-summary-workspace.controller';
import { CycleTimeSummaryWorkspaceService } from './cycle-time-summary-workspace.service';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const locId = '';
const testSumId = '';
const id = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};
const dto = new CycleTimeSummaryDTO();

const payload = new CycleTimeSummaryBaseDTO();

const mockService = () => ({
  createCycleTimeSummary: jest.fn().mockResolvedValue(dto),
  getCycleTimeSummary: jest.fn().mockResolvedValue(dto),
  getCycleTimeSummaries: jest.fn().mockResolvedValue([dto]),
  updateCycleTimeSummary: jest.fn().mockResolvedValue(dto),
  deleteCycleTimeSummary: jest.fn().mockResolvedValue(undefined),
});

describe('CycleTimeSummaryWorkspaceController', () => {
  let controller: CycleTimeSummaryWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CycleTimeSummaryWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: CycleTimeSummaryWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<CycleTimeSummaryWorkspaceController>(
      CycleTimeSummaryWorkspaceController,
    );
  });

  describe('getCycleTimeSummary', () => {
    it('Calls the service to get a Cycle Time Summary record', async () => {
      const result = await controller.getCycleTimeSummary(locId, testSumId, id);
      expect(result).toEqual(dto);
    });
  });

  describe('getCycleTimeSummaries', () => {
    it('Calls the service to many Cycle Time Summary records', async () => {
      const result = await controller.getCycleTimeSummaries(locId, testSumId);
      expect(result).toEqual([dto]);
    });
  });

  describe('createCycleTimeSummary', () => {
    it('Calls the service and create a new Cycle Time Summary record', async () => {
      const result = await controller.createCycleTimeSummary(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('updateCycleTimeSummary', () => {
    it('Calls the service and update a existing Cycle Time Summary record', async () => {
      const result = await controller.updateCycleTimeSummary(
        locId,
        testSumId,
        id,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('deleteCycleTimeSummary', () => {
    it('Calls the service and delete a Cycle Time Summary record', async () => {
      const result = await controller.deleteCycleTimeSummary(
        locId,
        testSumId,
        id,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
