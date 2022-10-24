import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingRecordDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTestingWorkspaceController } from './air-emission-testing-workspace.controller';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { HttpModule } from '@nestjs/axios';
import { AirEmissionTestingChecksService } from './air-emission-testing-checks.service';

const locId = '';
const testSumId = '';
const airEmissiontestingId = '';

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};

const airEmissionTestingRecord = new AirEmissionTestingRecordDTO();

const payload = new AirEmissionTestingBaseDTO();

const mockCheckService = () => ({
  runChecks: jest.fn().mockResolvedValue(null),
});

const mockService = () => ({
  getAirEmissionTestings: jest
    .fn()
    .mockResolvedValue([airEmissionTestingRecord]),
  getAirEmissionTesting: jest.fn().mockResolvedValue(airEmissionTestingRecord),
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
      imports: [HttpModule],
      controllers: [AirEmissionTestingWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: AirEmissionTestingWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: AirEmissionTestingChecksService,
          useFactory: mockCheckService,
        },
      ],
    }).compile();

    controller = module.get<AirEmissionTestingWorkspaceController>(
      AirEmissionTestingWorkspaceController,
    );
  });

  describe('getAirEmissionTestings', () => {
    it('should get Air Emission Testing records by Linearity Summary Id', async () => {
      const result = await controller.getAirEmissionTestings(locId, testSumId);
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

  describe('createAirEmissionTesting', () => {
    it('Calls the service to create a new Air Emission Testing record', async () => {
      const result = await controller.createAirEmissionTesting(
        locId,
        testSumId,
        payload,
        user,
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
          user,
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
        user,
      );
      expect(result).toEqual(null);
    });
  });
});
