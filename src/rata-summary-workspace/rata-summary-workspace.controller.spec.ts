import { Test, TestingModule } from '@nestjs/testing';
import {
  RataSummaryBaseDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummaryWorkspaceController } from './rata-summary-workspace.controller';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';

const locId = '';
const testSumId = '';
const rataId = '';
const rataSumId = '';
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

const mockService = () => ({
  createRataSummary: jest.fn().mockResolvedValue(record),
  updateRataSummary: jest.fn().mockResolvedValue(record),
});

describe('RataSummaryWorkspaceController', () => {
  let controller: RataSummaryWorkspaceController;
  let service: RataSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataSummaryWorkspaceController],
      providers: [
        {
          provide: RataSummaryWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<RataSummaryWorkspaceController>(
      RataSummaryWorkspaceController,
    );
    service = module.get<RataSummaryWorkspaceService>(
      RataSummaryWorkspaceService,
    );
  });

  describe('createRataSummary', () => {
    it('should call the RataService.createRataSummary and insert a rata-summary record', async () => {
      expect(
        await controller.createRataSummary(locId, testSumId, rataId, payload),
      ).toEqual(record);
      expect(service.createRataSummary).toHaveBeenCalled();
    });
  });

  describe('updateRataSummary', () => {
    it('should call the RataService.updateRataSummary and update rata record', async () => {
      expect(
        await controller.updateRataSummary(
          locId,
          testSumId,
          rataId,
          rataSumId,
          payload,
        ),
      ).toEqual(record);
      expect(service.updateRataSummary).toHaveBeenCalled();
    });
  });
});
