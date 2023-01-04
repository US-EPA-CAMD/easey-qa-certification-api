import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestRunWorkspaceController } from './unit-default-test-run.controller';
import { UnitDefaultTestRunWorkspaceService } from './unit-default-test-run.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunRecordDTO,
} from '../dto/unit-default-test-run.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const id = '';
const locId = '';
const testSumId = '';
const unitDefaultTestSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};
const dto = new UnitDefaultTestRunRecordDTO();

const payload = new UnitDefaultTestRunBaseDTO();

const mockService = () => ({
  getUnitDefaultTestRun: jest.fn().mockResolvedValue(dto),
  getUnitDefaultTestRuns: jest.fn().mockResolvedValue([dto]),
  createUnitDefaultTestRun: jest.fn().mockResolvedValue(dto),
  updateUnitDefaultTestRun: jest.fn().mockResolvedValue(dto),
  deleteUnitDefaultTestRun: jest.fn().mockResolvedValue(null),
});

describe('UnitDefaultTestRunWorkspaceController', () => {
  let controller: UnitDefaultTestRunWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UnitDefaultTestRunWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: UnitDefaultTestRunWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<UnitDefaultTestRunWorkspaceController>(
      UnitDefaultTestRunWorkspaceController,
    );
  });

  describe('getUnitDefaultTestRun', () => {
    it('Calls the service to get a Unit Default Test Run record', async () => {
      const result = await controller.getUnitDefaultTestRun(
        locId,
        testSumId,
        unitDefaultTestSumId,
        id,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('getUnitDefaultTestRuns', () => {
    it('Calls the service to many Unit Default Test Run records', async () => {
      const result = await controller.getUnitDefaultTestRuns(
        locId,
        testSumId,
        unitDefaultTestSumId,
      );
      expect(result).toEqual([dto]);
    });
  });

  describe('createUnitDefaultTestRun', () => {
    it('Calls the service and create a new Unit Default Test Run record', async () => {
      const result = await controller.createUnitDefaultTestRun(
        locId,
        testSumId,
        unitDefaultTestSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('updateUnitDefaultTestRun', () => {
    it('should call the updateUnitDefaultTestRun and update Unit Default Test Run record', async () => {
      expect(
        await controller.updateUnitDefaultTestRun(
          locId,
          testSumId,
          unitDefaultTestSumId,
          id,
          payload,
          user,
        ),
      ).toEqual(dto);
    });
  });

  describe('deleteUnitDefaultTestRun', () => {
    it('Calls the service and deletes a Unit Default Test Run record', async () => {
      const result = await controller.deleteUnitDefaultTestRun(
        locId,
        testSumId,
        unitDefaultTestSumId,
        id,
        user,
      );
      expect(result).toEqual(null);
    });
  });
});
