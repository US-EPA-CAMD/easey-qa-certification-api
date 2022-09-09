import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestResultCodes } from '../enums/test-result-code.enum';
import { RataImportDTO } from '../dto/rata.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { RataFrequencyCode } from '../entities/workspace/rata-frequency-code.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { RataFrequencyCodeRepository } from '../rata-frequency-code/rata-frequency-code.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataChecksService } from './rata-checks.service';

const locationId = '';
const testSumId = '';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const monitorSystemRecord = new MonitorSystem();
let testSumRecord = {
  system: {
    systemTypeCode: 'FLOW',
  },
};
const rataFreqCdRecord = new RataFrequencyCode();

const importPayload = new RataImportDTO();
importPayload.numberOfLoadLevels = 1;
importPayload.rataFrequencyCode = 'OS';
importPayload.numberOfLoadLevels = 1;
importPayload.numberOfLoadLevels = 1;
const testSummaryImportPayload = new TestSummaryImportDTO();

const mockTestSummaryRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSumRecord),
});
const mockRataFrequencyCodeRepository = () => ({
  getRataFrequencyCode: jest.fn().mockResolvedValue(rataFreqCdRecord),
});
const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monitorSystemRecord),
});

describe('Rata Checks Service Test', () => {
  let service: RataChecksService;
  let testSummaryRepository: TestSummaryWorkspaceRepository;
  let rataFreqCodeRepository: RataFrequencyCodeRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        RataChecksService,
        {
          provide: RataFrequencyCodeRepository,
          useFactory: mockRataFrequencyCodeRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonitorSystemRepository,
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSummaryRepository,
        },
      ],
    }).compile();

    service = module.get(RataChecksService);
    testSummaryRepository = module.get(TestSummaryWorkspaceRepository);
    rataFreqCodeRepository = module.get(RataFrequencyCodeRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('RATA Checks', () => {
    it('Should pass all checks for Import', async () => {
      const result = await service.runChecks(
        locationId,
        importPayload,
        null,
        false,
        true,
        testSummaryImportPayload,
      );
      expect(result).toEqual([]);
    });

    it('Should pass all checks for POST or UPDATE', async () => {
      const result = await service.runChecks(
        locationId,
        importPayload,
        testSumId,
      );
      expect(result).toEqual([]);
    });
  });

  describe('RATA-102 Number of Load Levels Valid', () => {
    it('Should get [RATA-102-C] error ', async () => {
      importPayload.numberOfLoadLevels = 0;

      let testSumRec = new TestSummary();

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-102-B] error ', async () => {
      importPayload.numberOfLoadLevels = 0;

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('RATA-103 Overall Relative Accuracy Valid', () => {
    it('Should get [RATA-103-A] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 3;
      importPayload.rataFrequencyCode = null;
      importPayload.overallBiasAdjustmentFactor = null;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.ABORTED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-103-B] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = null;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-103-C] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = -1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('RATA-104 Overall BAF Valid', () => {
    it('Should get [RATA-104-A] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = null;
      importPayload.rataFrequencyCode = null;
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.ABORTED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-104-B] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = null;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-104-C] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 0;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('RATA-105 RATA Frequency Valid', () => {
    it('Should get [RATA-105-A] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = null;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.FAILED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-105-B] error ', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = null;
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-105-C] error with invalid rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'OS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);
      jest
        .spyOn(rataFreqCodeRepository, 'getRataFrequencyCode')
        .mockResolvedValue(null);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-105-C] error with "8QTRS" rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = '8QTRS';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';
      testSumRec.system = new MonitorSystem();
      testSumRec.system.systemDesignationCode = 'BS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);
      jest
        .spyOn(rataFreqCodeRepository, 'getRataFrequencyCode')
        .mockResolvedValue(rataFreqCdRecord);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-105-C] error with "ALTSL" rataFrequencyCode', async () => {
      importPayload.numberOfLoadLevels = 1;
      importPayload.relativeAccuracy = 1;
      importPayload.rataFrequencyCode = 'ALTSL';
      importPayload.overallBiasAdjustmentFactor = 1;

      let testSumRec = new TestSummary();
      testSumRec.testResultCode = TestResultCodes.PASSED;
      testSumRec.testTypeCode = '';
      testSumRec.system = new MonitorSystem();
      testSumRec.system.systemDesignationCode = 'BS';
      testSumRec.system.systemTypeCode = 'BS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRec);
      jest
        .spyOn(rataFreqCodeRepository, 'getRataFrequencyCode')
        .mockResolvedValue(rataFreqCdRecord);

      try {
        await service.runChecks(locationId, importPayload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
