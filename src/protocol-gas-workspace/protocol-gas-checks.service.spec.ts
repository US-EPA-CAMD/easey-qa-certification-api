import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { ProtocolGasImportDTO } from '../dto/protocol-gas.dto';
import { GasComponentCodeRepository } from '../gas-component-code/gas-component-code.repository';
import { GasComponentCode } from '../entities/gas-component-code.entity';
import { GasTypeCode } from '../entities/workspace/gas-type-code.entity';
import { GasTypeCodeRepository } from '../gas-type-code/gas-type-code.repository';

const locationId = '';
const testSumId = '';
const protolGas = new ProtocolGasImportDTO();
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

let testSumRecord = new TestSummary();
let monSysRec = new MonitorSystem();

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(new TestSummary()),
});

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monSysRec),
});

const mockGasComponentCodeRepository = () => ({
  find: jest.fn().mockResolvedValue([new GasComponentCode()]),
});

const mockGasTypeCodeRepository = () => ({
  find: jest.fn().mockResolvedValue([new GasTypeCode()]),
});

describe('Protocol Gas Checks Service', () => {
  let service: ProtocolGasChecksService;
  let testSummaryRepository: TestSummaryWorkspaceRepository;
  let gasComponentCodeRepository: GasComponentCodeRepository;
  let gasTypeCodeRepository: GasTypeCodeRepository;

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
        {
          provide: GasTypeCodeRepository,
          useFactory: mockGasTypeCodeRepository,
        },
      ],
    }).compile();

    service = module.get<ProtocolGasChecksService>(ProtocolGasChecksService);
    testSummaryRepository = module.get<TestSummaryWorkspaceRepository>(
      TestSummaryWorkspaceRepository,
    );
    gasComponentCodeRepository = module.get<GasComponentCodeRepository>(
      GasComponentCodeRepository,
    );
    gasTypeCodeRepository = module.get<GasTypeCodeRepository>(
      GasTypeCodeRepository,
    );

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('PGVP-8 Protocol Gas Record Consistent with Test', () => {
    it('Should get [PGVP-8-A] error', async () => {
      testSumRecord.testTypeCode = 'RATA';
      monSysRec.systemTypeCode = 'FLOW';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'GMIS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });
  });

  describe('PGVP-9 Gas Type Code Valid', () => {
    monSysRec.systemTypeCode = 'GAS';
    testSumRecord.system = monSysRec;
    protolGas.gasTypeCode = 'ZAM';
    testSumRecord.testTypeCode = 'GAS';

    it('Should get [PGVP-9-B] error', async () => {
      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasTypeCodeRepository, 'find')
        .mockResolvedValue([new GasTypeCode()]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });

    it('Should get [PGVP-9-C] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'APPVD';
      testSumRecord.testTypeCode = 'GAS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasTypeCodeRepository, 'find')
        .mockResolvedValue([new GasTypeCode()]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });

    it('Should get [PGVP-9-F] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZERO';
      testSumRecord.testTypeCode = 'GAS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([new GasComponentCode()]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });
  });

  describe('PGVP-12 Gas Type Code Component List Valid', () => {
    it('Should get [PGVP-12-B] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM';
      testSumRecord.testTypeCode = 'GAS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([new GasComponentCode()]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });

    it('Should get [PGVP-12-H] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM,ZAM';
      testSumRecord.testTypeCode = 'GAS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([new GasComponentCode()]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });

    it('Should get [PGVP-12-C] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM,ZAM';
      testSumRecord.testTypeCode = 'GAS';

      let gasCompCode = new GasComponentCode();
      gasCompCode.gasComponentCode = 'ZAM';
      gasCompCode.canCombineIndicator = 0;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });

    it('Should get [PGVP-12-G] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM,ZAM';
      testSumRecord.testTypeCode = 'GAS';

      let gasCompCode = new GasComponentCode();
      gasCompCode.gasComponentCode = 'ZAM';
      gasCompCode.balanceComponentIndicator = 1;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });
  });

  describe('PGVP-13 Protocol Gas Parameter Consistent with Gas Component List', () => {
    it('Should get [PGVP-13-A] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'SO2';
      testSumRecord.testTypeCode = 'GAS';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });

    it('Should get [PGVP-13-B] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'O2';
      testSumRecord.testTypeCode = 'GAS';

      let gasCompCode = new GasComponentCode();
      gasCompCode.gasComponentCode = 'NOX';
      gasCompCode.canCombineIndicator = 0;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
          MOCK_ERROR_MSG,
        ]);
      }
    });

    it('Should get [PGVP-13-C] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'NOX';
      testSumRecord.testTypeCode = 'LINE';

      let gasCompCode = new GasComponentCode();
      gasCompCode.gasComponentCode = 'NOX';
      gasCompCode.canCombineIndicator = 0;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-13-D] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'NOX';
      testSumRecord.testTypeCode = 'APPE';

      let gasCompCode = new GasComponentCode();
      gasCompCode.gasComponentCode = 'NOX';
      gasCompCode.balanceComponentIndicator = 1;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
