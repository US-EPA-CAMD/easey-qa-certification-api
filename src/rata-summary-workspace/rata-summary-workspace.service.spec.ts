import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import {
  RataSummaryBaseDTO,
  RataSummaryDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';

const dto = new RataSummaryDTO();

const testSumId = '';
const rataId = '';
const userId = 'testUser';
const entity = new RataSummary();
const record = new RataSummaryRecordDTO();

const payload: RataSummaryBaseDTO = {
  operatingLevelCode: 'H',
  averageGrossUnitLoad: 0,
  referenceMethodCode: '2',
  meanCEMValue: 0,
  meanRATAReferenceValue: 0,
  meanDifference: 0,
  standardDeviationDifference: 0,
  confidenceCoefficient: 0,
  tValue: 0,
  apsIndicator: 0,
  apsCode: 'PS15',
  relativeAccuracy: 0,
  biasAdjustmentFactor: 0,
  co2OrO2ReferenceMethodCode: 'L',
  stackDiameter: 0,
  stackArea: 0,
  numberOfTraversePoints: 0,
  calculatedWAF: 0,
  defaultWAF: 0,
};

const mockRepository = () => ({
  create: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  findOne: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('RataSummaryWorkspaceService', () => {
  let service: RataSummaryWorkspaceService;
  let repository: RataSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataSummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: RataSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataSummaryMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<RataSummaryWorkspaceService>(
      RataSummaryWorkspaceService,
    );
    repository = module.get<RataSummaryWorkspaceRepository>(
      RataSummaryWorkspaceRepository,
    );
  });

  describe('createRataSummary', () => {
    it('calls the repository.create() and insert a rata-summary record', async () => {
      const result = await service.createRataSummary(
        testSumId,
        rataId,
        payload,
        userId,
      );
      expect(result).toEqual(record);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('deleteRataSummary', () => {
    it('Should delete a Rata Summary record', async () => {
      const result = await service.deleteRataSummary(testSumId, rataId, userId);
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Rata Summary record', async () => {
      const error = new LoggingException(
        `Error deleting Rata Summary with record Id [${rataId}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteRataSummary(testSumId, rataId, userId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });
});
