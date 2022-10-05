import { Test, TestingModule } from '@nestjs/testing';
import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilRecordDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOilWorkspaceController } from './app-e-heat-input-from-oil.controller';
import { AppEHeatInputFromOilWorkspaceService } from './app-e-heat-input-from-oil.service';

const locId = '';
const testSumId = '';
const corrTestSumId = '';
const corrTestRunId = '';
const aeHiOilId = '';
const aeHiOilRecord = new AppEHeatInputFromOilRecordDTO();
const aeHiOilRecords = [aeHiOilRecord];

const mockService = () => ({
  getAppEHeatInputFromOilRecord: jest.fn().mockResolvedValue(aeHiOilRecord),
  getAppEHeatInputFromOilRecords: jest.fn(),
  createAppEHeatInputFromOilRecord: jest.fn(),
});

const payload: AppEHeatInputFromOilDTO = new AppEHeatInputFromOilDTO();

describe('Appendix E Heat Input from Oil Controller', () => {
  let controller: AppEHeatInputFromOilWorkspaceController;
  let service: AppEHeatInputFromOilWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppEHeatInputFromOilWorkspaceController],
      providers: [
        {
          provide: AppEHeatInputFromOilWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<AppEHeatInputFromOilWorkspaceController>(
      AppEHeatInputFromOilWorkspaceController,
    );
    service = module.get<AppEHeatInputFromOilWorkspaceService>(
      AppEHeatInputFromOilWorkspaceService,
    );
  });

  describe('getAppEHeatInputFromOilRecords', () => {
    it('Should call the AppEHeatInputFromOilWorkspaceService.getAppEHeatInputFromOilRecords', async () => {
      jest
        .spyOn(service, 'getAppEHeatInputFromOilRecords')
        .mockResolvedValue(aeHiOilRecords);
      expect(
        await controller.getAppEHeatInputFromOilRecords(
          locId,
          testSumId,
          corrTestSumId,
          corrTestRunId,
        ),
      ).toBe(aeHiOilRecords);
    });
  });

  describe('getAppEHeatInputFromOilRecord', () => {
    it('Calls the repository to get one Appendix E Heat Input from Oil record by Id', async () => {
      const result = await controller.getAppEHeatInputFromOilRecord(
        locId,
        testSumId,
        corrTestSumId,
        corrTestRunId,
        aeHiOilId,
      );
      expect(result).toEqual(aeHiOilRecord);
      expect(service.getAppEHeatInputFromOilRecord).toHaveBeenCalled();
    });
  });

  describe('createAppEHeatInputFromOilRecord', () => {
    it('should call the AppEHeatInputFromOilWorkspaceService.createAppEHeatInputFromOilRecord', async () => {
      jest
        .spyOn(service, 'createAppEHeatInputFromOilRecord')
        .mockResolvedValue(aeHiOilRecord);
      expect(
        await controller.createAppEHeatInputFromOilRecord(
          locId,
          testSumId,
          corrTestSumId,
          corrTestRunId,
          payload,
        ),
      ).toEqual(aeHiOilRecord);
    });
  });
});
