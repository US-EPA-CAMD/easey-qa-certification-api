import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TransmitterTransducerAccuracyService } from './transmitter-transducer-accuracy.service';
import { TransmitterTransducerAccuracyController } from './transmitter-transducer-accuracy.controller';
import {
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyRecordDTO,
} from '../dto/transmitter-transducer-accuracy.dto';

const locId = '';
const testSumId = '';
const entityId = '';
const recordDTO = new TransmitterTransducerAccuracyRecordDTO();
const dto = new TransmitterTransducerAccuracyDTO();

const mockService = () => ({
  getTransmitterTransducerAccuracy: jest.fn().mockResolvedValue(dto),
  getTransmitterTransducerAccuracies: jest.fn().mockResolvedValue([dto]),
});

describe('Transmitter Transducer Controller', () => {
  let controller: TransmitterTransducerAccuracyController;
  let service: TransmitterTransducerAccuracyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [TransmitterTransducerAccuracyController],
      providers: [
        ConfigService,
        AuthGuard,
        TestSummaryWorkspaceModule,
        {
          provide: TransmitterTransducerAccuracyService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<TransmitterTransducerAccuracyController>(
      TransmitterTransducerAccuracyController,
    );
    service = module.get<TransmitterTransducerAccuracyService>(
      TransmitterTransducerAccuracyService,
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
});
