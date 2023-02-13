import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { RataSummaryImportDTO } from '../dto/rata-summary.dto';

import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { FlowRataRunChecksService } from './flow-rata-run-checks.service';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { RataFrequencyCode } from '../entities/workspace/rata-frequency-code.entity';
import { FlowRataRunImportDTO } from '../dto/flow-rata-run.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { RataSummaryWorkspaceRepository } from '../rata-summary-workspace/rata-summary-workspace.repository';
import { RataRunWorkspaceRepository } from '../rata-run-workspace/rata-run-workspace.repository';
import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { RataSummaryRepository } from '../rata-summary/rata-summary.repository';
import { RataRun } from '../entities/workspace/rata-run.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestTypeCodes } from '../enums/test-type-code.enum';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const locationId = '';
const testSumId = '';
const rataSumId = '';
const rataRunId = '';
const flowRataRunId = '';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const monitorSystemRecord = new MonitorSystem();
let rataSumRecord = {
  system: {
    systemTypeCode: 'FLOW',
  },
};

const testSumRecord = new TestSummary();
testSumRecord.testTypeCode = TestTypeCodes.RATA

const importPayload = new FlowRataRunImportDTO();
importPayload.averageVelocityWithWallEffects = 1;
importPayload.averageStackFlowRate = 1;
const rataSummaryImportPayload = new RataSummaryImportDTO();

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSumRecord),
});

const mockRataSummaryRepository = () => ({
  findOne: jest.fn().mockResolvedValue(rataSumRecord),
});
const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monitorSystemRecord),
});
const mockRataSummaryWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(rataSumId),
});
const mockRataRunWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(rataRunId),
});
const mockFlowRataRunWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(flowRataRunId),
});

describe('Flow Rata Run Check Service Test', () => {
  let service: FlowRataRunChecksService;
  let rataSummaryRepository: RataSummaryWorkspaceRepository;
  let rataRunRepository: RataRunWorkspaceRepository;
  let repository: FlowRataRunWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        FlowRataRunChecksService,
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSumRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonitorSystemRepository,
        },
        {
          provide: RataSummaryRepository,
          useFactory: mockRataSummaryRepository,
        },
        {
          provide: RataSummaryWorkspaceRepository,
          useFactory: mockRataSummaryWorkspaceRepository,
        },
        {
          provide: RataRunWorkspaceRepository,
          useFactory: mockRataRunWorkspaceRepository,
        },
        {
          provide: FlowRataRunWorkspaceRepository,
          useFactory: mockFlowRataRunWorkspaceRepository,
        },
      ],
    }).compile();

    service = module.get(FlowRataRunChecksService);
    repository = module.get(FlowRataRunWorkspaceRepository);
    rataSummaryRepository = module.get(RataSummaryWorkspaceRepository);
    rataRunRepository = module.get(RataRunWorkspaceRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('RATA-94 Average Wet Stack Flow Rate Valid', () => {
    it('Should get [RATA-94-C] error', async () => {
      importPayload.averageStackFlowRate = 1;
      let rataRunRec = new RataRun();
      rataRunRec.rataReferenceValue = 2;

      jest.spyOn(rataRunRepository, 'findOne').mockResolvedValue(rataRunRec);
      try {
        await service.runChecks(importPayload, false, false, rataSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      try {
        await service.runChecks(
          importPayload,
          false,
          false,
          rataSumId,
          rataSummaryImportPayload,
          testSumId,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('RATA-114 Reported Average Velocity With Wall Effects Valid', () => {
    it('Should get [RATA-114-A] error', async () => {
      importPayload.averageVelocityWithWallEffects = 1;

      let rataSumRec = new RataSummary();
      rataSumRec.referenceMethodCode = '2F';

      jest
        .spyOn(rataSummaryRepository, 'findOne')
        .mockResolvedValue(rataSumRec);

      try {
        await service.runChecks(importPayload, false, false, rataSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
    it('Should get [RATA-114-B] error', async () => {
      importPayload.averageVelocityWithWallEffects = -1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.runChecks(importPayload, false, false, rataSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
    it('Should get [RATA-114-C] error', async () => {
      importPayload.calculatedWAF = 1;
      importPayload.averageVelocityWithWallEffects = null;

      let rataSumRec = new RataSummary();
      rataSumRec.referenceMethodCode = 'M2H';

      jest
        .spyOn(rataSummaryRepository, 'findOne')
        .mockResolvedValue(rataSumRec);

      try {
        await service.runChecks(importPayload, false, false, rataSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
  describe('RATA-115 Average Velocity Without Wall Effects Valid', () => {
    it('Should get [RATA-115-A] error', async () => {
      importPayload.averageVelocityWithoutWallEffects = 0;

      try {
        await service.runChecks(
          importPayload,
          false,
          false,
          rataSumId,
          rataSummaryImportPayload,
          rataRunId,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
  describe('RATA-124 Flow RATA Record Valid', () => {
    it('Should get [RATA-124-A] error', async () => {
      importPayload.averageVelocityWithoutWallEffects = 1;

      let rataSumRec = new RataSummary();
      rataSumRec.referenceMethodCode = 'A';

      jest
        .spyOn(rataSummaryRepository, 'findOne')
        .mockResolvedValue(rataSumRec);

      try {
        await service.runChecks(
          importPayload,
          false,
          false,
          rataSumId,
          rataSummaryImportPayload,
          rataRunId,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
    it('Should get [RATA-124-B] error', async () => {
      importPayload.averageVelocityWithoutWallEffects = 1;

      let testSumRec = new RataRun();
      testSumRec.runStatusCode = 'NOTUSED';

      jest.spyOn(rataRunRepository, 'findOne').mockResolvedValue(testSumRec);

      try {
        await service.runChecks(
          importPayload,
          false,
          false,
          rataSumId,
          rataSummaryImportPayload,
          rataRunId,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
