import { Test, TestingModule } from '@nestjs/testing';

import {
  TransmitterTransducerAccuracyBaseDTO,
  TransmitterTransducerAccuracyDTO,
} from '../dto/transmitter-transducer-accuracy.dto';
import { TransmitterTransducerAccuracy } from '../entities/transmitter-transducer-accuracy.entity';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TransmitterTransducerAccuracyRepository } from './transmitter-transducer-accuracy.repository';
import { TransmitterTransducerAccuracyService } from './transmitter-transducer-accuracy.service';

const entityId = 'a1b2c3';
const testSumId = 'd4e5f6';
const entity = new TransmitterTransducerAccuracy();
const dto = new TransmitterTransducerAccuracyDTO();

const payload: TransmitterTransducerAccuracyBaseDTO = {
  highLevelAccuracy: 0,
  highLevelAccuracySpecCode: '',
  lowLevelAccuracy: 0,
  lowLevelAccuracySpecCode: '',
  midLevelAccuracy: 0,
  midLevelAccuracySpecCode: '',
};

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
});

describe('TransmitterTransducerAccuracyService', () => {
  let service: TransmitterTransducerAccuracyService;
  let repository: TransmitterTransducerAccuracyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransmitterTransducerAccuracyService,
        TransmitterTransducerAccuracyMap,
        {
          provide: TransmitterTransducerAccuracyRepository,
          useFactory: mockRepository,
        },
        {
          provide: TransmitterTransducerAccuracyMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<TransmitterTransducerAccuracyService>(
      TransmitterTransducerAccuracyService,
    );
    repository = module.get<TransmitterTransducerAccuracyRepository>(
      TransmitterTransducerAccuracyRepository,
    );
  });

  describe('getProtocolGas', () => {
    it('Calls repository.findOneBy({id}) to get a single Transmitter Transducer Accuracy record', async () => {
      const result = await service.getTransmitterTransducerAccuracy(entityId);
      expect(result).toEqual(dto);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Gas record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getTransmitterTransducerAccuracy(entityId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getTransmitterTransducerAccuraciesByTestSumIds', () => {
    it('Should get UTransmitter Transducer Accuracy records by Test Summary Ids', async () => {
      const result = await service.getTransmitterTransducerAccuraciesByTestSumIds(
        [testSumId],
      );
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('Should export Transmitter Transducer Accuracy record', async () => {
      jest
        .spyOn(service, 'getTransmitterTransducerAccuraciesByTestSumIds')
        .mockResolvedValue([]);

      const result = await service.export([testSumId]);
      expect(result).toEqual([]);
    });
  });
});
