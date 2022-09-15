import { Test, TestingModule } from '@nestjs/testing';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingWorkspaceController } from './air-emission-testing-workspace.controller';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';

const locId = '';
const testSumId = '';
const airEmissiontestingId = '';

const airEmissionTestingRecord = new AirEmissionTestingRecordDTO();

const payload = new AirEmissionTestingBaseDTO();

const mockService = () => ({
  createAirEmissionTesting: jest
    .fn()
    .mockResolvedValue(airEmissionTestingRecord),
  updateAirEmissionTesting: jest
    .fn()
    .mockResolvedValue(airEmissionTestingRecord),
  deleteAirEmissionTesting: jest.fn().mockResolvedValue(null),
});

describe('AirEmissionTestingWorkspaceController', () => {
  let controller: AirEmissionTestingWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirEmissionTestingWorkspaceController],
      providers: [
        {
          provide: AirEmissionTestingWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AirEmissionTestingWorkspaceController>(
      AirEmissionTestingWorkspaceController,
    );
  });

  describe('createAirEmissionTesting', () => {
    it('Calls the service to create a new Air Emission Testing record', async () => {
      const result = await controller.createAirEmissionTesting(
        locId,
        testSumId,
        payload,
      );
      expect(result).toEqual(airEmissionTestingRecord);
    });
  });

  describe('updateAirEmissionTesting', () => {
    it('should call the updateAirEmissionTesting and update Air Emission Testing record', async () => {
      expect(
        await controller.updateAirEmissionTesting(
          locId,
          testSumId,
          airEmissiontestingId,
          payload,
        ),
      ).toEqual(airEmissionTestingRecord);
    });
  });

  describe('deleteAirEmissionTesting', () => {
    it('should call the RataService.deleteAirEmissionTesting and delete Air Emission Testing record', async () => {
      const result = await controller.deleteAirEmissionTesting(
        locId,
        testSumId,
        airEmissiontestingId,
      );
      expect(result).toEqual(null);
    });
  });
});
