import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { ProtocolGasImportDTO } from '../dto/protocol-gas.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { GasComponentCodeRepository } from '../gas-component-code/gas-component-code.repository';
import { GasComponentCode } from '../entities/gas-component-code.entity';

const locationId = '';
const testSumId = '';
const protolGas = new ProtocolGasImportDTO();
const testSummary = new TestSummaryImportDTO();
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

let testSumRecord = new TestSummary();
let monSysRec = new MonitorSystem();

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(new TestSummary()),
});

const mockTestSummaryRepository = () => ({
  findOne: jest.fn().mockResolvedValue(testSumRecord),
});

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monSysRec),
});

const mockGasComponentCodeRepository = () => ({
  find: jest.fn().mockResolvedValue(null),
})

describe('Protocol Gas Checks Service', () => {
  let service: ProtocolGasChecksService;
  let testSummaryRepository: TestSummaryWorkspaceRepository;
  let gasComponentCodeRepository: GasComponentCodeRepository;

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
        {
          provide: GasComponentCodeRepository,
          useFactory: mockGasComponentCodeRepository,
        },
      ],
    }).compile();

    service = module.get<ProtocolGasChecksService>(ProtocolGasChecksService);
    testSummaryRepository = module.get<TestSummaryWorkspaceRepository>(
      TestSummaryWorkspaceRepository,
    );
    gasComponentCodeRepository = module.get<GasComponentCodeRepository>(GasComponentCodeRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('PGVP-8 Protocol Gas Record Consistent with Test', () => {
    it('Should get [PGVP-8-A] error', async () => {

      monSysRec.systemTypeCode = 'FLOW';
      testSumRecord.system = monSysRec;

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue(null)

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
  });

  describe('PGVP-9 Gas Type Code Valid', () => {
    it('Should get [PGVP-9-B] error', async () => {

      monSysRec.systemTypeCode = 'GAS'
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM';
      testSumRecord.testTypeCode = 'GAS'

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-9-C] error', async () => {

      monSysRec.systemTypeCode = 'GAS'
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'APPVD';
      testSumRecord.testTypeCode = 'GAS'

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-9-F] error', async () => {

      monSysRec.systemTypeCode = 'GAS'
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZERO';
      testSumRecord.testTypeCode = 'GAS'

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
  });

  describe('PGVP-12 Gas Type Code Component List Valid', () => {
    it('Should get [PGVP-12-B] error', async () => {

      monSysRec.systemTypeCode = 'GAS'
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM';
      testSumRecord.testTypeCode = 'GAS'

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
    
    it('Should get [PGVP-12-H] error', async () => {

      monSysRec.systemTypeCode = 'GAS'
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM,ZAM';
      testSumRecord.testTypeCode = 'GAS'

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-12-C] error', async () => {

      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM,ZAM';
      testSumRecord.testTypeCode = 'GAS';

      let gasCompCode = new GasComponentCode;
      gasCompCode.gasComponentCode = 'ZAM';
      gasCompCode.canCombineIndicator = 0;

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([gasCompCode])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-12-G] error', async () => {

      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM,ZAM';
      testSumRecord.testTypeCode = 'GAS';

      let gasCompCode = new GasComponentCode;
      gasCompCode.gasComponentCode = 'ZAM';
      gasCompCode.balanceComponentIndicator = 1;

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([gasCompCode])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
  });

  describe('PGVP-13 Protocol Gas Parameter Consistent with Gas Component List', () => {
    it('Should get [PGVP-13-A] error', async () => {

      monSysRec.systemTypeCode = 'GAS'
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'SO2';
      testSumRecord.testTypeCode = 'GAS'

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
    
    it('Should get [PGVP-13-B] error', async () => {
      monSysRec.systemTypeCode = 'GAS'
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'O2';
      testSumRecord.testTypeCode = 'GAS'

      let gasCompCode = new GasComponentCode;
      gasCompCode.gasComponentCode = 'NOX';
      gasCompCode.canCombineIndicator = 0;

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([gasCompCode])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-13-C] error', async () => {
      monSysRec.systemTypeCode = 'GAS'
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'NOX';
      testSumRecord.testTypeCode = 'LINE'

      let gasCompCode = new GasComponentCode;
      gasCompCode.gasComponentCode = 'NOX';
      gasCompCode.canCombineIndicator = 0;

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([gasCompCode])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-13-D] error', async () => {

      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'NOX';
      testSumRecord.testTypeCode = 'APPE';

      let gasCompCode = new GasComponentCode;
      gasCompCode.gasComponentCode = 'NOX';
      gasCompCode.balanceComponentIndicator = 1;

      jest.spyOn(testSummaryRepository, 'getTestSummaryById').mockResolvedValue(testSumRecord)
      jest.spyOn(gasComponentCodeRepository, 'find').mockResolvedValue([gasCompCode])

      try {
        await service.runChecks(
          protolGas,
          locationId,
          testSumId,
          false,
          false,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
  });
});
