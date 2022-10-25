import { Test, TestingModule } from '@nestjs/testing';
import { AirEmissionTestingRecordDTO } from '../dto/air-emission-test.dto';
import { AirEmissionTestingController } from './air-emission-testing.controller';
import { AirEmissionTestingService } from './air-emission-testing.service';

const locId = '';
const testSumId = '';
const airEmissiontestingId = '';

const airEmissionTestingRecord = new AirEmissionTestingRecordDTO();

const mockService = () => ({
  getAirEmissionTestings: jest
    .fn()
    .mockResolvedValue([airEmissionTestingRecord]),
  getAirEmissionTesting: jest.fn().mockResolvedValue(airEmissionTestingRecord),
});

describe('AirEmissionTestingController', () => {
  let controller: AirEmissionTestingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirEmissionTestingController],
      providers: [
        {
          provide: AirEmissionTestingService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AirEmissionTestingController>(
      AirEmissionTestingController,
    );
  });

  describe('getAirEmissionTestings', () => {
    it('should get Air Emission Testing records by Linearity Summary Id', async () => {
      const result = await controller.getAirEmissionsTestings(locId, testSumId);
      expect(result).toEqual([airEmissionTestingRecord]);
    });
  });

  describe('getAirEmissionTesting', () => {
    it('should get Air Emission Testing record', async () => {
      const result = await controller.getAirEmissionsTesting(
        locId,
        testSumId,
        airEmissiontestingId,
      );
      expect(result).toEqual(airEmissionTestingRecord);
    });
  });
});
