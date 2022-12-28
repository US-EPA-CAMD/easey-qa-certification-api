import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestRunWorkspaceController } from './unit-default-test-run.controller';
import { UnitDefaultTestRunWorkspaceService } from './unit-default-test-run.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunDTO,
} from '../dto/unit-default-test-run.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const locId = '';
const testSumId = '';
const unitDefaultTestSumId = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};
const dto = new UnitDefaultTestRunDTO();

const payload = new UnitDefaultTestRunBaseDTO();

const mockService = () => ({
  createUnitDefaultTestRun: jest.fn().mockResolvedValue(dto),
});

describe('UnitDefaultTestRunWorkspaceController', () => {
  let controller: UnitDefaultTestRunWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UnitDefaultTestRunWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: UnitDefaultTestRunWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<UnitDefaultTestRunWorkspaceController>(
      UnitDefaultTestRunWorkspaceController,
    );
  });

  describe('createUnitDefaultTestRun', () => {
    it('Calls the service and create a new Unit Default Test Run record', async () => {
      const result = await controller.createUnitDefaultTestRun(
        locId,
        testSumId,
        unitDefaultTestSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

});
