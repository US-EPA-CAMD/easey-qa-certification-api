import { Test, TestingModule } from '@nestjs/testing';
import {
  AirEmissionTestBaseDTO,
  AirEmissionTestDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTest } from '../entities/workspace/air-emission-test.entity';
import { AirEmissionTestMap } from '../maps/air-emission-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AirEmissionTestWorkspaceRepository } from './air-emission-test-workspace.repository';
import { AirEmissionTestWorkspaceService } from './air-emission-test-workspace.service';

const testSumId = '';
const historicalRecordId = '1';
const userId = 'user';
const entity = new AirEmissionTest();
const airEmissionTestRecord = new AirEmissionTestDTO();

const payload: AirEmissionTestBaseDTO = new AirEmissionTestBaseDTO();

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(airEmissionTestRecord),
  many: jest.fn().mockResolvedValue([airEmissionTestRecord]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('AirEmissionTestWorkspaceService', () => {
  let service: AirEmissionTestWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: AirEmissionTestWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirEmissionTestWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AirEmissionTestWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AirEmissionTestMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AirEmissionTestWorkspaceService>(
      AirEmissionTestWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<AirEmissionTestWorkspaceRepository>(
      AirEmissionTestWorkspaceRepository,
    );
  });

  describe('createAirEmissionTest', () => {
    it('Should create and return a new Air Emission Test record', async () => {
      const result = await service.createAirEmissionTest(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(airEmissionTestRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should create and return a new Air Emission Test record using historical Record id', async () => {
      const result = await service.createAirEmissionTest(
        testSumId,
        payload,
        userId,
        false,
        historicalRecordId,
      );

      expect(result).toEqual(airEmissionTestRecord);
    });
  });
});
