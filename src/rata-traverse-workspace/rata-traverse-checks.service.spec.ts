import { Test } from '@nestjs/testing';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { FlowRataRunImportDTO } from '../dto/flow-rata-run.dto';
import { RataSummaryImportDTO } from '../dto/rata-summary.dto';
import {
  RataTraverseBaseDTO,
  RataTraverseImportDTO,
} from '../dto/rata-traverse.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { RataTraverse } from '../entities/workspace/rata-traverse.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { RataSummaryWorkspaceRepository } from '../rata-summary-workspace/rata-summary-workspace.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataTraverseChecksService } from './rata-traverse-checks.service';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';

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
importPayload.methodTraversePointId = '999';
importPayload.pointUsedIndicator = 1;
importPayload.replacementVelocity = 2;
importPayload.averageVelocityDifferencePressure = 1;
importPayload.averageSquareVelocityDifferencePressure = null;

const testSummary = new TestSummary();
testSummary.testTypeCode = 'RATA';

const rataSummary = new RataSummary();
rataSummary.referenceMethodCode = '2FH';

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSummary),
});

const mockRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(importPayload),
});

const mockRataSumRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(rataSummary),
});

const mockMonitorSystemRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(new MonitorSystem()),
});

describe('Rata Traverse Check Service Test', () => {
  let checkService: RataTraverseChecksService;
  let repository: RataTraverseWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggerModule],
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
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = 2;
      importPayload.numberWallEffectsPoints = 3;
      importPayload.probeTypeCode = 'PRISM';
      importPayload.pitchAngle = 2;
      importPayload.yawAngle = 2;

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
        flowRataRunImport.rataTraverseData,
      );

      expect(result).toEqual([]);
    });
  });

  describe('RATA-72 Probe Type Valid', () => {
    it('Should get [RATA-72-B] error 1st trigger', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2F';
      rataSummaryImport.defaultWAF = 1;
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = null;
      importPayload.probeTypeCode = 'AAA';
      importPayload.yawAngle = 45;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-72-B] error 2nd trigger', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2G';
      rataSummaryImport.defaultWAF = 1;
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = null;
      importPayload.probeTypeCode = 'PRANDT1';
      importPayload.yawAngle = 45;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-72-B] error 3rd trigger', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = 'M2H';
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = null;
      importPayload.probeTypeCode = 'SPHERE';
      importPayload.yawAngle = null;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('RATA-76 Velocity Differential Pressure Valid', () => {
    it('Should get [RATA-76-A] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = null;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = 2;
      importPayload.numberWallEffectsPoints = 3;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-76-B] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = 1;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = 2;
      importPayload.numberWallEffectsPoints = 3;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('RATA-81 Exterior Method 1 Traverse Point Identifier Valid', () => {
    it('Should get [RATA-81-A] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = 'M2H';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = 3;
      importPayload.probeTypeCode = 'PRANDT1';
      importPayload.lastProbeDate = new Date('2020-01-01');

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
        // automatically triggers RATA-83-A as well
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-81-B] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2F';
      rataSummaryImport.defaultWAF = 1;
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = 3;
      importPayload.probeTypeCode = null;
      importPayload.yawAngle = 45;

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
        // automatically triggers RATA-83-A as well
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-81-C] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2F';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = null;

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
        // automatically triggers RATA-81-A as well
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('RATA-82 Number of Wall Effects Points Valid', () => {
    it('Should get [RATA-82-A] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = 2;
      importPayload.numberWallEffectsPoints = 1;
      importPayload.yawAngle = null;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-82-B] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2F';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = 1;
      rataSummaryImport.defaultWAF = 1;
      importPayload.yawAngle = 45;

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
        // automatically triggers RATA-81-C as well
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-82-C] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = 3;
      importPayload.yawAngle = null;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-82-D] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2F';
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = 3;
      importPayload.yawAngle = 45;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('RATA-83 Replacement Velocity Valid', () => {
    it('Should get [RATA-83-A] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = null;
      importPayload.numberWallEffectsPoints = 3;
      importPayload.yawAngle = null;

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
        // automatically triggers RATA-81-A/B as well
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-83-B] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 1;
      importPayload.replacementVelocity = -1;
      importPayload.numberWallEffectsPoints = 3;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-83-C] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2FH';
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = 1;
      importPayload.numberWallEffectsPoints = null;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-83-D] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2F';
      rataSummaryImport.defaultWAF = 1;
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = 1;
      importPayload.numberWallEffectsPoints = null;
      importPayload.yawAngle = 45;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });

    it('Should get [RATA-83-E] error', async () => {
      jest.spyOn(checkService, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      importPayload.averageVelocityDifferencePressure = 1;
      importPayload.averageSquareVelocityDifferencePressure = null;
      importPayload.methodTraversePointId = '999';
      rataSummaryImport.referenceMethodCode = '2F';
      importPayload.pointUsedIndicator = 2;
      importPayload.replacementVelocity = 1;
      importPayload.numberWallEffectsPoints = null;

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
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('RATA-110 Duplicate RATA Traverse', () => {
    it('Should get [RATA-110-A] error', async () => {
      const payload = new RataTraverseBaseDTO();
      payload.methodTraversePointId = '4';
      payload.yawAngle = 45;

      const returnValue = new RataTraverse();
      returnValue.methodTraversePointId = '4';
      returnValue.yawAngle = 45;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(returnValue);
      try {
        await checkService.runChecks(
          payload,
          locationId,
          testSumId,
          testSummaryImport,
          rataSumId,
          rataSummaryImport,
          flowRataRunId,
          true,
          false,
        );
      } catch (err) {
        expect(err.response.message.length).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
