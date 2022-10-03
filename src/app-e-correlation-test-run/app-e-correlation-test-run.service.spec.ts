import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestRunDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { AppECorrelationTestRunRepository } from './app-e-correlation-test-run.repository';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';

const appECorrTestSumId = 'g7h8i9';
const appECorrTestRunId = 'g7h8i9';
const appECorrelationTestRunRecord = new AppECorrelationTestRunDTO();
const appECorrelationTestRunEntity = new AppECorrelationTestRun();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(appECorrelationTestRunRecord),
  many: jest.fn().mockResolvedValue([appECorrelationTestRunRecord]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([appECorrelationTestRunEntity]),
  findOne: jest.fn().mockResolvedValue(appECorrelationTestRunEntity),
});

describe('AppECorrelationTestRunService', () => {
  let service: AppECorrelationTestRunService;
  let repository: AppECorrelationTestRunRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppECorrelationTestRunService,
        {
          provide: AppECorrelationTestRunRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppECorrelationTestRunMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AppECorrelationTestRunService>(
      AppECorrelationTestRunService,
    );
    repository = module.get<AppECorrelationTestRunRepository>(
      AppECorrelationTestRunRepository,
    );
  });

  describe('getAppECorrelationTestRun', () => {
    it('Calls repository.findOne({id}) to get a single Appendix E Correlation Test Run record', async () => {
      const result = await service.getAppECorrelationTestRun(appECorrTestRunId);
      expect(result).toEqual(appECorrelationTestRunRecord);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Appendix E Correlation Test Run record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getAppECorrelationTestRun(appECorrTestRunId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getAppECorrelationTestRuns', () => {
    it('Calls Repository to find all Appendix E Correlation Test Run records for a given Test Summary ID', async () => {
      const results = await service.getAppECorrelationTestRuns(
        appECorrTestSumId,
      );
      expect(results).toEqual([appECorrelationTestRunRecord]);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});
