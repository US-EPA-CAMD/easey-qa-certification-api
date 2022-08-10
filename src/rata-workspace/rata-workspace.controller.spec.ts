import { Test, TestingModule } from '@nestjs/testing';
import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataWorkspaceController } from './rata-workspace.controller';
import { RataWorkspaceService } from './rata-workspace.service';

const locId = '';
const testSumId = '';
const rataRecord = new RataRecordDTO();

const payload: RataBaseDTO = {
  rataFrequencyCode: 'OS',
  relativeAccuracy: 0,
  overallBiasAdjustmentFactor: 0,
  numberLoadLevel: 0,
};

const mockService = () => ({
  createRata: jest.fn().mockResolvedValue(rataRecord),
});

describe('RataWorkspaceController', () => {
  let controller: RataWorkspaceController;
  let service: RataWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataWorkspaceController],
      providers: [
        {
          provide: RataWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<RataWorkspaceController>(RataWorkspaceController);
    service = module.get<RataWorkspaceService>(RataWorkspaceService);
  });

  describe('createRata', () => {
    it('should call the RataService.createRata', async () => {
      jest.spyOn(service, 'createRata').mockResolvedValue(rataRecord);
      expect(await controller.createRata(locId, testSumId, payload)).toEqual(
        rataRecord,
      );
    });
  });
});
