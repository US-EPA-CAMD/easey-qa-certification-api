import { Test } from '@nestjs/testing';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { RataTraverseChecksService } from './rata-traverse-checks.service';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { RataTraverseBaseDTO, RataTraverseImportDTO } from '../dto/rata-traverse.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { RataSummaryImportDTO } from '../dto/rata-summary.dto';
import { FlowRataRunImportDTO } from '../dto/flow-rata-run.dto';
import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';
import { RataSummaryWorkspaceRepository } from '../rata-summary-workspace/rata-summary-workspace.repository';
import { RataTraverse } from '../entities/workspace/rata-traverse.entity';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const locationId = '';
const testSumId = '';
const rataSumId = '';
const flowRataRunId = '';
const testSummaryImport = new TestSummaryImportDTO();
const rataSummaryImport = new RataSummaryImportDTO();
const flowRataRunImport = new FlowRataRunImportDTO();
testSummaryImport.testTypeCode = 'RATA';

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const importPayload = new RataTraverseImportDTO();
importPayload.methodTraversePointID = '999';
importPayload.pointUsedIndicator = 1;
importPayload.replacementVelocity = 2;
importPayload.avgVelDiffPressure = 1;
importPayload.avgSquareVelDiffPressure = null;

const testSummary = new TestSummary();
testSummary.testTypeCode = 'RATA';

const rataSummary = new RataSummary();
rataSummary.referenceMethodCode = '2FH';

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSummary),
});

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(importPayload),
})

const mockRataSumRepository = () => ({
  findOne: jest.fn().mockResolvedValue(rataSummary),
})

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new MonitorSystem()),
});

describe('Rata Traverse Check Service Test', () => {
  let checkService: RataTraverseChecksService;
  let repository: RataTraverseWorkspaceRepository;

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
          provide: RataTraverseWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonitorSystemRepository,
        },
        {
          provide: RataSummaryWorkspaceRepository,
          useFactory: mockRataSumRepository,
        },
      ],
    }).compile();

    checkService = module.get(RataTraverseChecksService);
    repository = module.get(RataTraverseWorkspaceRepository);
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
      importPayload.methodTraversePointID = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = 2;

      const result = await checkService.runChecks(
        importPayload,
        locationId,
        testSumId,
        testSummaryImport,
        rataSumId,
        rataSummaryImport,
        flowRataRunId,
        true,
        false,
        flowRataRunImport.rataTraverseData
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
          null,
          null,
          null,
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
          null,
          null,
          null,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('RATA-83 Replacement Velocity Valid', () => {
    it('Should get [RATA-83-A] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.avgVelDiffPressure = null;
      importPayload.avgSquareVelDiffPressure = 1;
      importPayload.replacementVelocity = null;

      try {
        await checkService.runChecks(
          importPayload,
          locationId,
          testSumId,
          testSummaryImport,
          null,
          rataSummaryImport,
          null,
          true,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-83-B] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.replacementVelocity = -1;

      try {
        await checkService.runChecks(
          importPayload,
          locationId,
          testSumId,
          testSummaryImport,
          null,
          rataSummaryImport,
          null,
          true,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-83-C] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = 1;
      rataSummaryImport.referenceMethodCode = 'M2H';

      try {
        await checkService.runChecks(
          importPayload,
          locationId,
          testSumId,
          testSummaryImport,
          null,
          rataSummaryImport,
          null,
          true,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-83-D] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = 1;
      rataSummaryImport.defaultWAF = 3;

      try {
        await checkService.runChecks(
          importPayload,
          locationId,
          testSumId,
          testSummaryImport,
          null,
          rataSummaryImport,
          null,
          true,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-83-E] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      rataSummaryImport.referenceMethodCode = '2F';
      importPayload.replacementVelocity = 1;

      try {
        await checkService.runChecks(
          importPayload,
          locationId,
          testSumId,
          testSummaryImport,
          null,
          rataSummaryImport,
          null,
          true,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('RATA-110 Duplicate RATA Traverse', () => {
    it('Should get [RATA-110-A] error', async () => {
      const payload = new RataTraverseBaseDTO();
      payload.methodTraversePointID = '4';

      const returnValue = new RataTraverse();
      returnValue.methodTraversePointID = '4';

      jest.spyOn(repository, 'findOne').mockResolvedValue(returnValue);
      try {
        await checkService.runChecks(payload, locationId, testSumId, testSummaryImport, rataSumId, rataSummaryImport, flowRataRunId, true, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
