import { Test, TestingModule } from '@nestjs/testing';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppendixETestSummaryController } from './app-e-correlation-test-summary.controller';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';

const locId = 'locationId';
const testSumId = 'testSummaryId';
const appendixECorrelationTestSummaryId = 'appendixECorrelationTestSummaryId';
const appECorrelationTest = new AppECorrelationTestSummaryBaseDTO();
const appECorrelationTests = [appECorrelationTest];

const appECorrelationTestSummaryDTO = new AppECorrelationTestSummaryDTO();

const mockAppECorrelationTestSummaryService = () => ({
  getAppECorrelations: jest
    .fn()
    .mockResolvedValue([appECorrelationTestSummaryDTO]),
  getAppECorrelation: jest
    .fn()
    .mockResolvedValue(appECorrelationTestSummaryDTO),
});

describe('AppendixETestSummaryController', () => {
  let controller: AppendixETestSummaryController;
  let service: AppECorrelationTestSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppendixETestSummaryController],
      providers: [
        {
          provide: AppECorrelationTestSummaryService,
          useFactory: mockAppECorrelationTestSummaryService,
        },
      ],
    }).compile();

    controller = module.get<AppendixETestSummaryController>(
      AppendixETestSummaryController,
    );
    service = module.get<AppECorrelationTestSummaryService>(
      AppECorrelationTestSummaryService,
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
});
