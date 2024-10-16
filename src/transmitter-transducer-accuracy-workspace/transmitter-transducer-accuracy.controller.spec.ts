import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';

import {
  TransmitterTransducerAccuracyBaseDTO,
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TransmitterTransducerAccuracyWorkspaceController } from './transmitter-transducer-accuracy.controller';
import { TransmitterTransducerAccuracyWorkspaceService } from './transmitter-transducer-accuracy.service';

const locId = '';
const testSumId = '';
const entityId = '';
const dto = new TransmitterTransducerAccuracyDTO();
const recordDTO = new TransmitterTransducerAccuracyRecordDTO();

const mockService = () => ({
  getTransmitterTransducerAccuracy: jest.fn().mockResolvedValue(dto),
  getTransmitterTransducerAccuracies: jest.fn().mockResolvedValue([dto]),
  createTransmitterTransducerAccuracy: jest.fn(),
  updateTransmitterTransducerAccuracy: jest.fn().mockResolvedValue(dto),
  deleteTransmitterTransducerAccuracy: jest.fn().mockResolvedValue(undefined),
});

const payload: TransmitterTransducerAccuracyBaseDTO = {
  highLevelAccuracy: 0,
  highLevelAccuracySpecCode: '',
  lowLevelAccuracy: 0,
  lowLevelAccuracySpecCode: '',
  midLevelAccuracy: 0,
  midLevelAccuracySpecCode: '',
};

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

describe('Transmitter Transducer Workspace Controller', () => {
  let controller: TransmitterTransducerAccuracyWorkspaceController;
  let service: TransmitterTransducerAccuracyWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [TransmitterTransducerAccuracyWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        TestSummaryWorkspaceModule,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: TransmitterTransducerAccuracyWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransmitterTransducerAccuracyWorkspaceController>(
      TransmitterTransducerAccuracyWorkspaceController,
    );
    service = module.get<TransmitterTransducerAccuracyWorkspaceService>(
      TransmitterTransducerAccuracyWorkspaceService,
    );
  });

  describe('getTransmitterTransducerAccuracies', () => {
    it('Should call the service to get all records for a Test Summary ID', async () => {
      const result = await controller.getTransmitterTransducerAccuracies(
        locId,
        testSumId,
      );

      expect(result).toEqual([recordDTO]);
    });
  });

  describe('getTransmitterTransducerAccuracy', () => {
    it('Calls the service to get one record by Id', async () => {
      const result = await controller.getTransmitterTransducerAccuracy(
        locId,
        testSumId,
        entityId,
      );
      expect(result).toEqual(recordDTO);
      expect(service.getTransmitterTransducerAccuracy).toHaveBeenCalled();
    });
  });

  describe('createTransmitterTransducerAccuracy', () => {
    it('Should call the service to create a Transmitter Transducer Accuracy record', async () => {
      jest
        .spyOn(service, 'createTransmitterTransducerAccuracy')
        .mockResolvedValue(recordDTO);
      expect(
        await controller.createTransmitterTransducerAccuracy(
          locId,
          testSumId,
          payload,
          user,
        ),
      ).toEqual(recordDTO);
    });
  });

  describe('updateCalibrationInjection', () => {
    it('Calls the service and update a existing Transmitter Transducer Accuracy record', async () => {
      const result = await controller.updateTransmitterTransducerAccuracy(
        locId,
        testSumId,
        entityId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('deleteCalibrationInjection', () => {
    it('Calls the service and delete a Calibration Injection record', async () => {
      const result = await controller.deleteTransmitterTransducerAccuracy(
        locId,
        testSumId,
        entityId,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
