import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestRunRecordDTO } from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunController } from './unit-default-test-run.controller';
import { UnitDefaultTestRunService } from './unit-default-test-run.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

const locId = '';
const id = '';
const testSumId = '';
const unitDefaultTestSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  permissionSet: [],
};
const dto = new UnitDefaultTestRunRecordDTO();

const mockService = () => ({
  getUnitDefaultTestRun: jest.fn().mockResolvedValue(dto),
  getUnitDefaultTestRuns: jest.fn().mockResolvedValue([dto]),
});

describe('UnitDefaultTestRunController', () => {
  let controller: UnitDefaultTestRunController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitDefaultTestRunController],
      providers: [
        {
          provide: UnitDefaultTestRunService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<UnitDefaultTestRunController>(
      UnitDefaultTestRunController,
    );
  });

  describe('getUnitDefaultTestRun', () => {
    it('Calls the service to get a Unit Default Test Run record', async () => {
      const result = await controller.getUnitDefaultTestRun(
        locId,
        testSumId,
        unitDefaultTestSumId,
        id,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('getUnitDefaultTestRuns', () => {
    it('Calls the service to many Unit Default Test Run records', async () => {
      const result = await controller.getUnitDefaultTestRuns(
        locId,
        testSumId,
        unitDefaultTestSumId,
      );
      expect(result).toEqual([dto]);
    });
  });
});
