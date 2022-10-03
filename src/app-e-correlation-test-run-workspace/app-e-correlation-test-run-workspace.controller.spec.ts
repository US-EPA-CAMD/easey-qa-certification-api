import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunWorkspaceController } from './app-e-correlation-test-run-workspace.controller';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};

const locId = 'a1b2c3';
const testSumId = 'd4e5f6';
const appECorrTestSumId = 'g7h8i9';
const appECorrTestRunId = 'g7h8i9';
const appECorrelationTestRun = new AppECorrelationTestRunDTO();
const appECorrelationTestRuns = [appECorrelationTestRun];

const payload: AppECorrelationTestRunBaseDTO = new AppECorrelationTestRunBaseDTO();

const mockService = () => ({
  getAppECorrelationTestRuns: jest
    .fn()
    .mockResolvedValue(appECorrelationTestRuns),
  getAppECorrelationTestRun: jest
    .fn()
    .mockResolvedValue(appECorrelationTestRun),
  createAppECorrelationTestRun: jest
    .fn()
    .mockResolvedValue(appECorrelationTestRun),
});

describe('AppECorrelationTestRunWorkspaceController', () => {
  let controller: AppECorrelationTestRunWorkspaceController;
  let service: AppECorrelationTestRunWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppECorrelationTestRunWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: AppECorrelationTestRunWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AppECorrelationTestRunWorkspaceController>(
      AppECorrelationTestRunWorkspaceController,
    );
    service = module.get<AppECorrelationTestRunWorkspaceService>(
      AppECorrelationTestRunWorkspaceService,
    );
  });

  describe('getAppECorrelationTestRuns', () => {
    it('Calls service to get all Appendix E Correlation Test Run records for a given Test Summary ID', async () => {
      const results = await controller.getAppECorrelationTestRuns(
        locId,
        testSumId,
        appECorrTestSumId,
      );
      expect(results).toEqual(appECorrelationTestRuns);
      expect(service.getAppECorrelationTestRuns).toHaveBeenCalled();
    });
  });

  describe('getAppECorrelationTestRun', () => {
    it('Calls service to get one Appendix E Correlation Test Run record by its ID', async () => {
      const results = await controller.getAppECorrelationTestRun(
        locId,
        testSumId,
        appECorrTestSumId,
        appECorrTestRunId,
      );
      expect(results).toEqual(appECorrelationTestRun);
      expect(service.getAppECorrelationTestRun).toHaveBeenCalled();
    });
  });

  describe('createAppECorrelationTestRun', () => {
    it('Calls service and create a Appendix E Correlation Test Run record', async () => {
      const results = await controller.createAppECorrelationTestRun(
        locId,
        testSumId,
        appECorrTestSumId,
        payload,
        user,
      );
      expect(results).toEqual(appECorrelationTestRun);
      expect(service.createAppECorrelationTestRun).toHaveBeenCalled();
    });
  });
});
