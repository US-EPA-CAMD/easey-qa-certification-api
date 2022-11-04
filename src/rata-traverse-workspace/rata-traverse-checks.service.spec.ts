import { Test } from '@nestjs/testing';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { RataTraverseChecksService } from './rata-traverse-checks.service';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { RataTraverseImportDTO } from '../dto/rata-traverse.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const locationId = '';
const testSumId = '';
const testSummaryImport = new TestSummaryImportDTO();
testSummaryImport.testTypeCode = 'RATA';

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const importPayload = new RataTraverseImportDTO();

const testSummary = new TestSummary();
testSummary.testTypeCode = 'RATA';

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSummary),
});

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new MonitorSystem()),
});

describe('Rata Traverse Check Service Test', () => {
  let checkService: RataTraverseChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        RataTraverseChecksService,
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSumRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonitorSystemRepository,
        },
      ],
    }).compile();

    checkService = module.get(RataTraverseChecksService);
  });

  describe('getMessage', () => {
    it('Should return a message', async () => {
      jest
        .spyOn(CheckCatalogService, 'formatResultMessage')
        .mockReturnValue(MOCK_ERROR_MSG);

      const result = await checkService.getMessage('TEST-1', {});

      expect(result).toEqual(MOCK_ERROR_MSG);
    });
  });

  describe('runChecks', () => {
    it('Should pass all checks', async () => {
      importPayload.avgVelDiffPressure = 1;
      importPayload.avgSquareVelDiffPressure = null;

      const result = await checkService.runChecks(
        importPayload,
        locationId,
        testSumId,
        testSummaryImport,
        true,
        false,
      );

      expect(result).toEqual([]);
    });
  });

  describe('RATA-76 Velocity Differential Pressure Valid', () => {
    it('Should get [RATA-76-A] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.avgVelDiffPressure = null;
      importPayload.avgSquareVelDiffPressure = null;

      try {
        await checkService.runChecks(
          importPayload,
          locationId,
          testSumId,
          testSummaryImport,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-76-B] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.avgVelDiffPressure = 1;
      importPayload.avgSquareVelDiffPressure = 1;

      try {
        await checkService.runChecks(
          importPayload,
          locationId,
          testSumId,
          testSummaryImport,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
