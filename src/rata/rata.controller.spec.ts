import { Test, TestingModule } from '@nestjs/testing';
import { RataRecordDTO } from '../dto/rata.dto';
import { RataController } from './rata.controller';
import { RataService } from './rata.service';

const locId = '';
const testSumId = '';
const rataId = '';
const rataRecord = new RataRecordDTO();

const mockService = () => ({
  getRatasByTestSumId: jest.fn().mockResolvedValue([rataRecord]),
  getRataById: jest.fn().mockResolvedValue(rataRecord),
});

describe('RataController', () => {
  let controller: RataController;
  let service: RataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataController],
      providers: [
        {
          provide: RataService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<RataController>(RataController);
    service = module.get<RataService>(RataService);
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
});
