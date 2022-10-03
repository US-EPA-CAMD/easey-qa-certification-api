import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestRunDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunController } from './app-e-correlation-test-run.controller';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';

const locId = 'a1b2c3';
const testSumId = 'd4e5f6';
const appECorrTestSumId = 'g7h8i9';
const appECorrTestRunId = 'g7h8i9';
const appECorrelationTestRun = new AppECorrelationTestRunDTO();
const appECorrelationTestRuns = [appECorrelationTestRun];

const mockService = () => ({
  getAppECorrelationTestRuns: jest
    .fn()
    .mockResolvedValue(appECorrelationTestRuns),
  getAppECorrelationTestRun: jest
    .fn()
    .mockResolvedValue(appECorrelationTestRun),
});

describe('AppECorrelationTestRunController', () => {
  let controller: AppECorrelationTestRunController;
  let service: AppECorrelationTestRunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppECorrelationTestRunController],
      providers: [
        {
          provide: AppECorrelationTestRunService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AppECorrelationTestRunController>(
      AppECorrelationTestRunController,
    );
    service = module.get<AppECorrelationTestRunService>(
      AppECorrelationTestRunService,
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
});
