import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';

import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestRecordDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestWorkspaceController } from './unit-default-test-workspace.controller';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';

const locId = '';
const id = '';
const testSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};
const dto = new UnitDefaultTestRecordDTO();

const payload = new UnitDefaultTestBaseDTO();

const mockService = () => ({
  createUnitDefaultTest: jest.fn().mockResolvedValue(dto),
  updateUnitDefaultTest: jest.fn().mockResolvedValue(dto),
  getUnitDefaultTest: jest.fn().mockResolvedValue(dto),
  getUnitDefaultTests: jest.fn().mockResolvedValue([dto]),
  deleteUnitDefaultTest: jest.fn().mockResolvedValue(null),
});

describe('UnitDefaultTestWorkspaceController', () => {
  let controller: UnitDefaultTestWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UnitDefaultTestWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: UnitDefaultTestWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<UnitDefaultTestWorkspaceController>(
      UnitDefaultTestWorkspaceController,
    );
  });

  describe('getUnitDefaultTest', () => {
    it('Calls the service to get a Unit Default Test record', async () => {
      const result = await controller.getUnitDefaultTest(locId, testSumId, id);
      expect(result).toEqual(dto);
    });
  });

  describe('getUnitDefaultTests', () => {
    it('Calls the service to many Unit Default Test records', async () => {
      const result = await controller.getUnitDefaultTests(locId, testSumId);
      expect(result).toEqual([dto]);
    });
  });

  describe('createUnitDefaultTest', () => {
    it('Calls the service and create a new Unit Default Test record', async () => {
      const result = await controller.createUnitDefaultTest(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('updateUnitDefaultTest', () => {
    it('should call the updateUnitDefaultTest and update Unit Default Test record', async () => {
      expect(
        await controller.updateUnitDefaultTest(
          locId,
          testSumId,
          id,
          payload,
          user,
        ),
      ).toEqual(dto);
    });
  });

  describe('deleteUnitDefaultTest', () => {
    it('Calls the service and deletes a Unit Default Test record', async () => {
      const result = await controller.deleteUnitDefaultTest(
        locId,
        id,
        testSumId,
        user,
      );
      expect(result).toEqual(null);
    });
  });
});
