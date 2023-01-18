import { Test, TestingModule } from '@nestjs/testing';
import { TestExtensionExemptionsWorkspaceController } from './test-extension-exemptions-workspace.controller';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};

const testExtExp = new TestExtensionExemptionRecordDTO();

const payload = new TestExtensionExemptionBaseDTO();

const mockTestExtensionExemptionWorkspaceService = () => ({
  createTestExtensionExemption: jest.fn().mockResolvedValue(testExtExp),
});

describe('TestExtensionExemptionsWorkspaceController', () => {
  let controller: TestExtensionExemptionsWorkspaceController;
  let service: TestExtensionExemptionsWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [TestExtensionExemptionsWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,

        {
          provide: TestExtensionExemptionsWorkspaceService,
          useFactory: mockTestExtensionExemptionWorkspaceService,
        },
      ],
    }).compile();

    controller = module.get<TestExtensionExemptionsWorkspaceController>(
      TestExtensionExemptionsWorkspaceController,
    );
    service = module.get(TestExtensionExemptionsWorkspaceService);
  });

  describe('createTestExtensionExemption', () => {
    it('should create test summary record', async () => {
      const spyService = jest.spyOn(service, 'createTestExtensionExemption');
      const result = await controller.createTestExtensionExemption(
        '1',
        payload,
        user,
      );
      expect(result).toEqual(testExtExp);
    });
  });
});
