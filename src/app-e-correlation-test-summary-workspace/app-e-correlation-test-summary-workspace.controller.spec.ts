import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { AppECorrelationTestSummaryBaseDTO } from '../dto/app-e-correlation-test-summary.dto';
import { AppendixETestSummaryWorkspaceController } from './app-e-correlation-test-summary-workspace.controller';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';

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
const appendixECorrelationTestSummaryId = 'appendixECorrelationTestSummaryId';
const appECorrelationTest = new AppECorrelationTestSummaryBaseDTO();
const appECorrelationTests = [appECorrelationTest];

const mockService = () => ({
  getAppECorrelations: jest.fn().mockResolvedValue(appECorrelationTests),
  getAppECorrelation: jest.fn().mockResolvedValue(appECorrelationTest),
  createAppECorrelation: jest.fn().mockResolvedValue(appECorrelationTest),
});

const payload = new AppECorrelationTestSummaryBaseDTO();

describe('AppendixETestSummaryWorkspaceController', () => {
  let controller: AppendixETestSummaryWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppendixETestSummaryWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: AppECorrelationTestSummaryWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AppendixETestSummaryWorkspaceController>(
      AppendixETestSummaryWorkspaceController,
    );
  });

  describe('getAppECorrelations', () => {
    it('Calls the repository to get all Appendix E Correlation Test Summary records by Test Summary Id', async () => {
      const result = await controller.getAppECorrelations(locId, testSumId);
      expect(result).toEqual(appECorrelationTests);
    });
  });

  describe('getAppECorrelation', () => {
    it('Calls the repository to get one Appendix E Correlation Test Summary record by Id', async () => {
      const result = await controller.getAppECorrelation(
        locId,
        appendixECorrelationTestSummaryId,
      );
      expect(result).toEqual(appECorrelationTest);
    });
  });

  describe('createAppECorrelation', () => {
    it('Calls the service to create a new Appendix E Correlation Test Summary record', async () => {
      const result = await controller.createAppECorrelation(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(appECorrelationTest);
    });
  });
});
