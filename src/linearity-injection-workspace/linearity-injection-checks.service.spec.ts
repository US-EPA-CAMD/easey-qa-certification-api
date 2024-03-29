import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';
import {
  LinearityInjectionBaseDTO,
  LinearityInjectionImportDTO,
} from '../dto/linearity-injection.dto';
import { LinearityInjectionChecksService } from './linearity-injection-checks.service';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearitySummaryWorkspaceRepository } from '../linearity-summary-workspace/linearity-summary.repository';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const testSumId = '1';
const linSumId = '1';

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(null),
});

const linInj = new LinearityInjection();
const linSum = new LinearitySummary();
linSum.injections = [linInj];

const mockLinearySummaryRepository = () => ({
  getSummaryById: jest.fn().mockResolvedValue(linSum),
});

const mockTestSummaryRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(new TestSummary()),
});

describe('Linearity Injection Check Service Test', () => {
  let service: LinearityInjectionChecksService;
  let repository: LinearityInjectionWorkspaceRepository;
  let linearitySummaryRepository: LinearitySummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearityInjectionChecksService,
        {
          provide: LinearityInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: LinearitySummaryWorkspaceRepository,
          useFactory: mockLinearySummaryRepository,
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSummaryRepository,
        },
      ],
    }).compile();

    service = module.get(LinearityInjectionChecksService);
    repository = module.get(LinearityInjectionWorkspaceRepository);
    linearitySummaryRepository = module.get(
      LinearitySummaryWorkspaceRepository,
    );

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Linearity Injection Checks', () => {
    const payload = new LinearityInjectionBaseDTO();
    it('Should pass all checks', async () => {
      const result = await service.runChecks(payload, linSumId, testSumId);
      expect(result).toEqual([]);
    });
  });

  describe('LINEAR-33 Duplicate Linearity Injection (Result A)', () => {
    const payload = new LinearityInjectionBaseDTO();
    payload.injectionDate = new Date('2022-01-12');
    payload.injectionHour = 1;
    payload.injectionMinute = 1;

    const returnValue = new LinearityInjection();
    returnValue.injectionDate = new Date('2022-01-12');
    returnValue.injectionHour = 1;
    returnValue.injectionMinute = 1;

    it('Should get already exists error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(returnValue);

      try {
        await service.runChecks(payload, linSumId, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });
  });

  describe('LINEAR-34 Too Many Gas Injections (Result A)', () => {
    const payload = new LinearityInjectionBaseDTO();
    payload.injectionDate = new Date('2022-01-12');
    payload.injectionHour = 1;
    payload.injectionMinute = 1;

    it('Should get error when There were more than three gas injections for [Linearity Summary] while importing', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const linInjImportDto = new LinearityInjectionImportDTO();
      const testSumImportDto = new TestSummaryImportDTO();
      testSumImportDto.testTypeCode = TestTypeCodes.LINE;
      const importpayload = [linInjImportDto, linInjImportDto, linInjImportDto];
      linInjImportDto.injectionDate = new Date('2022-01-12');
      linInjImportDto.injectionHour = 1;
      linInjImportDto.injectionMinute = 1;
      importpayload.push(linInjImportDto);

      try {
        await service.runChecks(
          payload,
          linSumId,
          testSumId,
          true,
          false,
          importpayload,
          testSumImportDto,
        );
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get error when There were more than three gas injections for [Linearity Summary]', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      linSum.injections = [linInj, linInj, linInj, linInj];
      jest
        .spyOn(linearitySummaryRepository, 'getSummaryById')
        .mockResolvedValue(linSum);

      try {
        await service.runChecks(payload, linSumId, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
