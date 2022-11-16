import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TransmitterTransducerAccuracyWorkspaceService } from './transmitter-transducer-accuracy.service';
import { TransmitterTransducerAccuracy } from '../entities/workspace/transmitter-transducer-accuracy.entity';
import { TransmitterTransducerAccuracyWorkspaceController } from './transmitter-transducer-accuracy.controller';
import { ProtocolGasDTO, ProtocolGasRecordDTO } from '../dto/protocol-gas.dto';
import {
  TransmitterTransducerAccuracyBaseDTO,
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';

const locId = '';
const testSumId = '';
const recordDTO = new TransmitterTransducerAccuracyRecordDTO();

const mockService = () => ({
  createTransmitterTransducerAccuracy: jest.fn(),
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
  isAdmin: false,
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
});
