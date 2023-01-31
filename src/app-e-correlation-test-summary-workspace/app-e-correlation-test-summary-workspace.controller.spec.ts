import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { AppECorrelationTestSummaryBaseDTO } from '../dto/app-e-correlation-test-summary.dto';
import { AppendixETestSummaryWorkspaceController } from './app-e-correlation-test-summary-workspace.controller';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { AppECorrelationTestSummaryChecksService } from './app-e-correlation-test-summary-checks.service';

const locId = '';
const testSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
};
const appendixECorrelationTestSummaryId = '';
const appECorrelationTest = new AppECorrelationTestSummaryBaseDTO();
const appECorrelationTests = [appECorrelationTest];

const mockService = () => ({
  getAppECorrelations: jest.fn().mockResolvedValue(appECorrelationTests),
  getAppECorrelation: jest.fn().mockResolvedValue(appECorrelationTest),
  createAppECorrelation: jest.fn().mockResolvedValue(appECorrelationTest),
  editAppECorrelation: jest.fn().mockResolvedValue(appECorrelationTest),
});

const mockChecksService = () => ({
  runChecks: jest.fn(),
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
        {
          provide: AppECorrelationTestSummaryChecksService,
          useFactory: mockChecksService,
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
        testSumId,
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

  describe('editAppECorrelation', () => {
    it('should call the Appendix E Correlation Test Summary record', async () => {
      expect(
        await controller.editAppECorrelation(
          locId,
          testSumId,
          appendixECorrelationTestSummaryId,
          payload,
          user,
        ),
      ).toEqual(appECorrelationTest);
    });
  });
});
