import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { ProtocolGasImportDTO } from '../dto/protocol-gas.dto';
import { GasComponentCodeRepository } from '../gas-component-code/gas-component-code.repository';
import { GasComponentCode } from '../entities/gas-component-code.entity';
import { CrossCheckCatalogValueRepository } from '../cross-check-catalog-value/cross-check-catalog-value.repository';
import { CrossCheckCatalogValue } from '../entities/cross-check-catalog-value.entity';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { Component } from '../entities/workspace/component.entity';

const locationId = '';
const testSumId = '';
const protolGas = new ProtocolGasImportDTO();
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

let testSumRecord = new TestSummary();
let monSysRec = new MonitorSystem();
let component = new Component();
let crossCheckCatalogValue = new CrossCheckCatalogValue();
let pgParameterGasTypeCodes: CrossCheckCatalogValue = crossCheckCatalogValue;
let protocolGasParameter: string = null;

const mockTestSumRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSumRecord),
});

const mockMonitorSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue(monSysRec),
});

const mockGasComponentCodeRepository = () => ({
  find: jest.fn().mockResolvedValue([new GasComponentCode()]),
});

const mockComponentWorkspaceRepository = () => ({
  find: jest.fn().mockResolvedValue([component]),
  findOne: jest.fn().mockResolvedValue(component),
});

const mockCrossCheckCatalogValueRepository = () => ({
  getParameterAndTypes: jest.fn().mockResolvedValue([crossCheckCatalogValue]),
});

describe('Protocol Gas Checks Service', () => {
  let service: ProtocolGasChecksService;
  let testSummaryRepository: TestSummaryWorkspaceRepository;
  let monitorSystemWorkspaceRepository: MonitorSystemWorkspaceRepository;
  let componentWorkspaceRepository: ComponentWorkspaceRepository;
  let gasComponentCodeRepository: GasComponentCodeRepository;
  let crossCheckCatalogValueRepository: CrossCheckCatalogValueRepository;

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
          provide: MonitorSystemWorkspaceRepository,
          useFactory: mockMonitorSystemRepository,
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: mockComponentWorkspaceRepository,
        },
        {
          provide: GasComponentCodeRepository,
          useFactory: mockGasComponentCodeRepository,
        },
        {
          provide: CrossCheckCatalogValueRepository,
          useFactory: mockCrossCheckCatalogValueRepository,
        },
      ],
    }).compile();

    service = module.get<ProtocolGasChecksService>(ProtocolGasChecksService);
    testSummaryRepository = module.get<TestSummaryWorkspaceRepository>(
      TestSummaryWorkspaceRepository,
    );
    monitorSystemWorkspaceRepository = module.get<
      MonitorSystemWorkspaceRepository
    >(MonitorSystemWorkspaceRepository);
    componentWorkspaceRepository = module.get<ComponentWorkspaceRepository>(
      ComponentWorkspaceRepository,
    );
    gasComponentCodeRepository = module.get<GasComponentCodeRepository>(
      GasComponentCodeRepository,
    );
    crossCheckCatalogValueRepository = module.get<
      CrossCheckCatalogValueRepository
    >(CrossCheckCatalogValueRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('PGVP-8 Protocol Gas Record Consistent with Test', () => {
    it('Should get [PGVP-8-A] error', async () => {
      testSumRecord.testTypeCode = 'RATA';
      monSysRec.systemTypeCode = 'FLOW';
      testSumRecord.system = monSysRec;

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      let errored = false;
      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        errored = true;
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
      expect(errored).toEqual(true);
    });
  });

  describe('PGVP-12 Gas Type Code Component List Valid', () => {
    it('Should get [PGVP-12-A] error', async () => {
      component.componentTypeCode = 'GAS';
      testSumRecord.component = component;
      protolGas.gasTypeCode = null;
      testSumRecord.testTypeCode = 'LINE';
      crossCheckCatalogValue.value2 = 'GAS,SO2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-12-B] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM';
      testSumRecord.testTypeCode = 'GAS';
      crossCheckCatalogValue.value2 = 'GAS,SO2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([new GasComponentCode()]);
      jest
        .spyOn(crossCheckCatalogValueRepository, 'getParameterAndTypes')
        .mockResolvedValue(crossCheckCatalogValue);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get [PGVP-12-H] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'ZAM,ZAM';
      testSumRecord.testTypeCode = 'GAS';
      crossCheckCatalogValue.value2 = 'GAS,SO2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([new GasComponentCode()]);
      jest
        .spyOn(crossCheckCatalogValueRepository, 'getParameterAndTypes')
        .mockResolvedValue(crossCheckCatalogValue);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
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
      crossCheckCatalogValue.value2 = 'GAS,SO2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);
      jest
        .spyOn(crossCheckCatalogValueRepository, 'getParameterAndTypes')
        .mockResolvedValue(crossCheckCatalogValue);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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

      crossCheckCatalogValue.value2 = 'GAS,SO2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);
      jest
        .spyOn(crossCheckCatalogValueRepository, 'getParameterAndTypes')
        .mockResolvedValue(crossCheckCatalogValue);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });

  describe('PGVP-13 Protocol Gas Parameter Consistent with Gas Component List', () => {
    it('Should get [PGVP-13-A] error', async () => {
      monSysRec.systemTypeCode = 'GAS';
      testSumRecord.system = monSysRec;
      protolGas.gasTypeCode = 'SO2';
      testSumRecord.testTypeCode = 'GAS';
      crossCheckCatalogValue.value2 = 'GAS,SO2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(crossCheckCatalogValueRepository, 'getParameterAndTypes')
        .mockResolvedValue(crossCheckCatalogValue);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
      crossCheckCatalogValue.value2 = 'GAS,SO2,O2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);
      jest
        .spyOn(crossCheckCatalogValueRepository, 'getParameterAndTypes')
        .mockResolvedValue(crossCheckCatalogValue);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
      crossCheckCatalogValue.value2 = 'NOX,SO2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);
      jest
        .spyOn(crossCheckCatalogValueRepository, 'getParameterAndTypes')
        .mockResolvedValue(crossCheckCatalogValue);

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

      crossCheckCatalogValue.value2 = 'NOX,SO2';

      jest
        .spyOn(testSummaryRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      jest
        .spyOn(gasComponentCodeRepository, 'find')
        .mockResolvedValue([gasCompCode]);
      jest
        .spyOn(crossCheckCatalogValueRepository, 'getParameterAndTypes')
        .mockResolvedValue(crossCheckCatalogValue);

      try {
        await service.runChecks(protolGas, locationId, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
