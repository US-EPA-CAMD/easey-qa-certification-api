import { Test, TestingModule } from '@nestjs/testing';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingWorkspaceController } from './air-emission-testing-workspace.controller';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';

const locId = '';
const testSumId = '';
const userId = 'testUser';

const airEmissionTestingRecord = new AirEmissionTestingRecordDTO();

const payload = new AirEmissionTestingBaseDTO();

const mockService = () => ({
  createAirEmissionTesting: jest
    .fn()
    .mockResolvedValue(airEmissionTestingRecord),
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
    it('Calls the service to create a new Air Emission Test record', async () => {
      const result = await controller.createAirEmissionTesting(
        locId,
        testSumId,
        payload,
      );
      expect(result).toEqual(airEmissionTestingRecord);
    });
  });
});
