import { Test, TestingModule } from '@nestjs/testing';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTesting } from '../entities/workspace/air-emission-test.entity';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';

const testSumId = '';
const airEmissiontestingId = '';
const historicalRecordId = '1';
const userId = 'user';
const entity = new AirEmissionTesting();
const airEmissionTestingRecord = new AirEmissionTestingDTO();

const payload: AirEmissionTestingBaseDTO = new AirEmissionTestingBaseDTO();

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(airEmissionTestingRecord),
  many: jest.fn().mockResolvedValue([airEmissionTestingRecord]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('AirEmissionTestingWorkspaceService', () => {
  let service: AirEmissionTestingWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: AirEmissionTestingWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirEmissionTestingWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AirEmissionTestingWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AirEmissionTestingMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AirEmissionTestingWorkspaceService>(
      AirEmissionTestingWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<AirEmissionTestingWorkspaceRepository>(
      AirEmissionTestingWorkspaceRepository,
    );
  });

  describe('createAirEmissionTesting', () => {
    it('Should create and return a new Air Emission Test record', async () => {
      const result = await service.createAirEmissionTesting(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(airEmissionTestingRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should create and return a new Air Emission Test record using historical Record id', async () => {
      const result = await service.createAirEmissionTesting(
        testSumId,
        payload,
        userId,
        false,
        historicalRecordId,
      );

      expect(result).toEqual(airEmissionTestingRecord);
    });
  });

  describe('updateAirEmissionTesting', () => {
    it('should update a Air Emission Testing', async () => {
      const result = await service.updateAirEmissionTesting(
        testSumId,
        airEmissiontestingId,
        payload,
        userId,
      );
      expect(result).toEqual(airEmissionTestingRecord);
    });

    it('should throw error with invalid Air Emission Testing', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateAirEmissionTesting(
          testSumId,
          airEmissiontestingId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });
});
