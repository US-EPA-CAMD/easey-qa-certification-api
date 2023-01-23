import { Test, TestingModule } from '@nestjs/testing';
import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilRecordDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOilWorkspaceController } from './app-e-heat-input-from-oil.controller';
import { AppEHeatInputFromOilWorkspaceService } from './app-e-heat-input-from-oil.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { HttpModule } from '@nestjs/axios';

const locId = '';
const testSumId = '';
const corrTestSumId = '';
const corrTestRunId = '';
const aeHiOilId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
};
const aeHiOilRecord = new AppEHeatInputFromOilRecordDTO();
const aeHiOilRecords = [aeHiOilRecord];
const aeHiOilDTO = new AppEHeatInputFromOilDTO();

const mockService = () => ({
  getAppEHeatInputFromOilRecord: jest.fn().mockResolvedValue(aeHiOilRecord),
  getAppEHeatInputFromOilRecords: jest.fn(),
  createAppEHeatInputFromOilRecord: jest.fn(),
  updateAppEHeatInputFromOilRecord: jest.fn(),
});

const payload: AppEHeatInputFromOilDTO = new AppEHeatInputFromOilDTO();

describe('Appendix E Heat Input from Oil Controller', () => {
  let controller: AppEHeatInputFromOilWorkspaceController;
  let service: AppEHeatInputFromOilWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AppEHeatInputFromOilWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
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
          user,
        ),
      ).toEqual(aeHiOilRecord);
    });
  });

  describe('updateAppEHeatInputFromOilRecord', () => {
    it('should call the AppEHeatInputFromOilWorkspaceService.updateAppEHeatInputFromOilRecord', async () => {
      jest
        .spyOn(service, 'updateAppEHeatInputFromOilRecord')
        .mockResolvedValue(aeHiOilDTO);
      expect(
        await controller.editAppEHeatInputFromOil(
          locId,
          testSumId,
          corrTestSumId,
          corrTestRunId,
          aeHiOilId,
          payload,
          user,
        ),
      ).toEqual(aeHiOilRecord);
    });
  });
});
