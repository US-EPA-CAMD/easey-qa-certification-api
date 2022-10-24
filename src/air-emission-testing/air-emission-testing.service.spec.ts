import { Test, TestingModule } from '@nestjs/testing';
import {
  AirEmissionTestingBaseDTO,
  AirEmissionTestingDTO,
} from '../dto/air-emission-test.dto';
import { AirEmissionTesting } from '../entities/air-emission-test.entity';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { AirEmissionTestingRepository } from './air-emission-testing.repository';
import { AirEmissionTestingService } from './air-emission-testing.service';

const id = '';
const testSumId = '';
const airEmissiontestingId = '';
const userId = 'user';
const entity = new AirEmissionTesting();
const airEmissionTestingRecord = new AirEmissionTestingDTO();

const payload: AirEmissionTestingBaseDTO = new AirEmissionTestingBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(airEmissionTestingRecord),
  many: jest.fn().mockResolvedValue([airEmissionTestingRecord]),
});

describe('AirEmissionTestingService', () => {
  let service: AirEmissionTestingService;
  let repository: AirEmissionTestingRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirEmissionTestingService,
        {
          provide: AirEmissionTestingRepository,
          useFactory: mockRepository,
        },
        {
          provide: AirEmissionTestingMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AirEmissionTestingService>(AirEmissionTestingService);
    repository = module.get<AirEmissionTestingRepository>(
      AirEmissionTestingRepository,
    );
  });

  describe('getAirEmissionTestings', () => {
    it('Should return Air Emission Testing records by Test Summary id', async () => {
      const result = await service.getAirEmissionTestings(testSumId);

      expect(result).toEqual([airEmissionTestingRecord]);
    });
  });

  describe('getAirEmissionTesting', () => {
    it('Should return a Air Emission Testing record', async () => {
      const result = await service.getAirEmissionTesting(id);

      expect(result).toEqual(airEmissionTestingRecord);
    });

    it('Should throw error when a Air Emission Testing record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getAirEmissionTesting(id);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });
});
