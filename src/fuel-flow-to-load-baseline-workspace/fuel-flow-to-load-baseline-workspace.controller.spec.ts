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
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};
const dto = new FuelFlowToLoadBaselineDTO();

const payload = new FuelFlowToLoadBaselineBaseDTO();

const mockService = () => ({
  createFuelFlowToLoadBaseline: jest.fn().mockResolvedValue(dto),
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

  describe('createFuelFlowToLoadBaseline', () => {
    it('Calls the service to create a new fuel Flow To Load Baseline record', async () => {
      const result = await controller.createFuelFlowToLoadBaseline(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });
});
