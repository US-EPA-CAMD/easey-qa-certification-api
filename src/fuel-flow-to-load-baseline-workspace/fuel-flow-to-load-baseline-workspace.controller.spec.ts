import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineWorkspaceController } from './fuel-flow-to-load-baseline-workspace.controller';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';

const locId = '';
const testSumId = '';
const id = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};
const dto = new FuelFlowToLoadBaselineDTO();

const payload = new FuelFlowToLoadBaselineBaseDTO();

const mockService = () => ({
  deleteFuelFlowToLoadBaseline: jest.fn().mockResolvedValue(undefined),
  updateFuelFlowToLoadBaseline: jest.fn().mockResolvedValue(dto),
  createFuelFlowToLoadBaseline: jest.fn().mockResolvedValue(dto),
  getFuelFlowToLoadBaseline: jest.fn().mockResolvedValue(dto),
  getFuelFlowToLoadBaselines: jest.fn().mockResolvedValue([dto]),
});

describe('FuelFlowToLoadBaselineWorkspaceController', () => {
  let controller: FuelFlowToLoadBaselineWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FuelFlowToLoadBaselineWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: FuelFlowToLoadBaselineWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<FuelFlowToLoadBaselineWorkspaceController>(
      FuelFlowToLoadBaselineWorkspaceController,
    );
  });

  describe('getFuelFlowToLoadBaseline', () => {
    it('Calls the service to get a fuel Flow To Load Baseline record', async () => {
      const result = await controller.getFuelFlowToLoadBaseline(
        locId,
        testSumId,
        id,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('getFuelFlowToLoadBaselines', () => {
    it('Calls the service to many fuel Flow To Load Baseline records', async () => {
      const result = await controller.getFuelFlowToLoadBaselines(
        locId,
        testSumId,
      );
      expect(result).toEqual([dto]);
    });
  });

  describe('createFuelFlowToLoadBaseline', () => {
    it('Calls the service and create a new fuel Flow To Load Baseline record', async () => {
      const result = await controller.createFuelFlowToLoadBaseline(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('updateFuelFlowToLoadBaseline', () => {
    it('Calls the service and update a existing fuel Flow To Load Baseline record', async () => {
      const result = await controller.updateFuelFlowToLoadBaseline(
        locId,
        testSumId,
        id,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('deleteFuelFlowToLoadBaseline', () => {
    it('Calls the service and delete a fuel Flow To Load Baseline record', async () => {
      const result = await controller.deleteFuelFlowToLoadBaseline(
        locId,
        testSumId,
        id,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
