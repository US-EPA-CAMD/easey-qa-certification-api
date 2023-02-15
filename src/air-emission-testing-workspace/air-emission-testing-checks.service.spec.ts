import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AirEmissionTestingImportDTO } from '../dto/air-emission-test.dto';

import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';
import { AirEmissionTestingChecksService } from './air-emission-testing-checks.service';

import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const locationId = '';
const testSumId = '';
const rataSumId = '';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const monitorSystemRecord = new MonitorSystem();

const mockTestSumRepository = () => ({
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(null),
  getTestSummaryById: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue(null),
});

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monitorSystemRecord),
});

describe('Air emission testing Check Service Test', () => {
  let service: AirEmissionTestingChecksService;
  let repository: AirEmissionTestingWorkspaceRepository;
  let testSumRepository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        AirEmissionTestingChecksService,
        {
          provide: AirEmissionTestingWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
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

    service = module.get(AirEmissionTestingChecksService);
    repository = module.get(AirEmissionTestingWorkspaceRepository);
    testSumRepository = module.get(TestSummaryWorkspaceRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('AETB-9 (Result B)', () => {
    const payload = new AirEmissionTestingImportDTO();
    payload.examDate = new Date('2000-01-01');

    it('Should get Result B', async () => {
      const testSummary = new TestSummary();
      testSummary.beginDate = new Date('1998-01-01');

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(testSumRepository, 'getTestSummaryById')
        .mockResolvedValue(testSummary);
      try {
        await service.runChecks(payload, testSumId, false, true);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
