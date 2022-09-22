import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import {
  RataSummaryBaseDTO,
  RataSummaryImportDTO,
} from '../dto/rata-summary.dto';

import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { RataSummaryChecksService } from './rata-summary-checks.service';

import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const locationId = '';
const testSumId = '';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const monitorSystemRecord = new MonitorSystem();
let testSumRecord = {
  system: {
    systemTypeCode: 'FLOW',
  },
};

const mockRepository = () => ({
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue(null),
});
const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monitorSystemRecord),
});

const mockTestSummaryRelationshipRepository = () => ({
  getTestTypeCodesRelationships: jest
    .fn()
    .mockResolvedValue([{ testResultCode: 'PASSED' }]),
});

describe('Rata Summary Check Service Test', () => {
  let service: RataSummaryChecksService;
  let repository: RataSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        RataSummaryChecksService,
        {
          provide: TestSummaryMasterDataRelationshipRepository,
          useFactory: mockTestSummaryRelationshipRepository,
        },
        {
          provide: RataSummaryWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(new MonitorSystem()),
          }),
        },
      ],
    }).compile();

    service = module.get(RataSummaryChecksService);
    repository = module.get(RataSummaryWorkspaceRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('IMPORT-30 (Result A)', () => {
    const payload = new RataSummaryImportDTO();
    (payload.co2OrO2ReferenceMethodCode = ''),
      payload.stackDiameter == 2,
      payload.stackArea == 2,
      payload.numberOfTraversePoints == 1,
      (payload.calculatedWAF = 1),
      (payload.defaultWAF = 1);

    it('Should get Result A', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      try {
        await service.runChecks(testSumId, payload);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }

      try {
        await service.runChecks(locationId, payload, testSumId, false, false, [
          payload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
