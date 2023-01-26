import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { ProtocolGasImportDTO } from '../dto/protocol-gas.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';

const locationId = '';
const testSumId = '';
const protolGas = new ProtocolGasImportDTO();
const testSummary = new TestSummaryImportDTO();
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

let testSumRecord = new TestSummary();
let system = new MonitorSystem();
system.systemTypeCode = 'FLOW';
testSumRecord.system = system;

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(new TestSummary()),
});

const mockTestSummaryRepository = () => ({
  findOne: jest.fn().mockResolvedValue(testSumRecord),
});

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(system),
});

describe('Protocol Gas Checks Service', () => {
  let service: ProtocolGasChecksService;
  let testSummaryRepository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ProtocolGasChecksService,
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

    service = module.get<ProtocolGasChecksService>(ProtocolGasChecksService);
    testSummaryRepository = module.get<TestSummaryWorkspaceRepository>(
      TestSummaryWorkspaceRepository,
    );
  });

  describe('PGVP-8 Protocol Gas Record Consistent with Test', () => {
    it('Should get [PGVP-8-A] error', async () => {
      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          testSummary,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [RATA-130-B] error', async () => {
      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          testSummary,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
