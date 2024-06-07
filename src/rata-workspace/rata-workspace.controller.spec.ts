import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';

import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataChecksService } from './rata-checks.service';
import { RataWorkspaceController } from './rata-workspace.controller';
import { RataWorkspaceService } from './rata-workspace.service';

const locId = '';
const testSumId = '';
const rataId = '';
const rataRecord = new RataRecordDTO();
const user: CurrentUser = {
  clientIp: '',
  expiration: '',
  facilities: [],
  roles: [],
  sessionId: '',
  userId: '',
};

const payload: RataBaseDTO = {
  rataFrequencyCode: 'OS',
  relativeAccuracy: 0,
  overallBiasAdjustmentFactor: 0,
  numberOfLoadLevels: 0,
};

const mockService = () => ({
  getRatasByTestSumId: jest.fn().mockResolvedValue([rataRecord]),
  getRataById: jest.fn().mockResolvedValue(rataRecord),
  createRata: jest.fn().mockResolvedValue(rataRecord),
  updateRata: jest.fn().mockResolvedValue(rataRecord),
  deleteRata: jest.fn().mockResolvedValue(null),
});

describe('RataWorkspaceController', () => {
  let controller: RataWorkspaceController;
  let service: RataWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [RataWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: RataWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: RataChecksService,
          useFactory: () => ({
            runChecks: jest.fn().mockResolvedValue([]),
          }),
        },
      ],
    }).compile();

    controller = module.get<RataWorkspaceController>(RataWorkspaceController);
    service = module.get<RataWorkspaceService>(RataWorkspaceService);
  });

  describe('getRata', () => {
    it('should call the RataService.getRataById and get one rata record', async () => {
      expect(await controller.getRata(locId, testSumId, rataId)).toEqual(
        rataRecord,
      );
      expect(service.getRataById).toHaveBeenCalled();
    });
  });

  describe('getRatas', () => {
    it('should call the RataService.getRatasByTestSumId and get many rata record', async () => {
      expect(await controller.getRatas(locId, testSumId)).toEqual([rataRecord]);
      expect(service.getRatasByTestSumId).toHaveBeenCalled();
    });
  });

  describe('createRata', () => {
    it('should call the RataService.createRata and insert a rata record', async () => {
      expect(
        await controller.createRata(locId, testSumId, payload, user),
      ).toEqual(rataRecord);
      expect(service.createRata).toHaveBeenCalled();
    });
  });

  describe('updateRata', () => {
    it('should call the RataService.updateRata and update rata record', async () => {
      expect(
        await controller.updateRata(locId, testSumId, rataId, payload, user),
      ).toEqual(rataRecord);
      expect(service.updateRata).toHaveBeenCalled();
    });
  });

  describe('deleteRata', () => {
    it('should call the RataService.deleteRata and delete rata record', async () => {
      const result = await controller.deleteRata(
        locId,
        testSumId,
        rataId,
        user,
      );
      expect(result).toEqual(null);
      expect(service.deleteRata).toHaveBeenCalled();
    });
  });
});
