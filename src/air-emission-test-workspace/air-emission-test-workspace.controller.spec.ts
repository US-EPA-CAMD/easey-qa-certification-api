import { Test, TestingModule } from '@nestjs/testing';
import {
  AirEmissionTestBaseDTO,
  AirEmissionTestRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestWorkspaceController } from './air-emission-test-workspace.controller';
import { AirEmissionTestWorkspaceService } from './air-emission-test-workspace.service';

const locId = '';
const testSumId = '';
const userId = 'testUser';

const airEmissionTestRecord = new AirEmissionTestRecordDTO();

const payload = new AirEmissionTestBaseDTO();

const mockService = () => ({
  createAirEmissionTest: jest.fn().mockResolvedValue(airEmissionTestRecord),
});

describe('AirEmissionTestWorkspaceController', () => {
  let controller: AirEmissionTestWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirEmissionTestWorkspaceController],
      providers: [
        {
          provide: AirEmissionTestWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AirEmissionTestWorkspaceController>(
      AirEmissionTestWorkspaceController,
    );
  });

  describe('createAirEmissionTest', () => {
    it('Calls the service to create a new Air Emission Test record', async () => {
      const result = await controller.createAirEmissionTest(
        locId,
        testSumId,
        payload,
      );
      expect(result).toEqual(airEmissionTestRecord);
    });
  });
});
