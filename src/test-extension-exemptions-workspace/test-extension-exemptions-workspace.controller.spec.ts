import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { TestExtensionExemptionsWorkspaceController } from './test-extension-exemptions-workspace.controller';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionsChecksService } from './test-extension-exemptions-checks.service';

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const testExtExp = new TestExtensionExemptionRecordDTO();

const payload = new TestExtensionExemptionBaseDTO();

const mockTestExtensionExemptionWorkspaceService = () => ({
  createTestExtensionExemption: jest.fn().mockResolvedValue(testExtExp),
  updateTestExtensionExemption: jest.fn().mockResolvedValue(testExtExp),
  getTestExtensionExemptionById: jest.fn().mockResolvedValue(testExtExp),
  getTestExtensionExemptionsByLocationId: jest
    .fn()
    .mockResolvedValue([testExtExp]),
  deleteTestExtensionExemption: jest.fn().mockResolvedValue(''),
});

const mockChecksService = () => ({
  runChecks: jest.fn().mockResolvedValue([]),
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
          provide: DataSource,
          useValue: {},
        },
        {
          provide: TestExtensionExemptionsWorkspaceService,
          useFactory: mockTestExtensionExemptionWorkspaceService,
        },
        {
          provide: TestExtensionExemptionsChecksService,
          useFactory: mockChecksService,
        },
      ],
    }).compile();

    controller = module.get<TestExtensionExemptionsWorkspaceController>(
      TestExtensionExemptionsWorkspaceController,
    );
    service = module.get(TestExtensionExemptionsWorkspaceService);
  });

  describe('getTestExtensionExemption', () => {
    it('should call the TestSummaryWorkspaceService.getTestExtensionExemptionById', async () => {
      const spyService = jest.spyOn(service, 'getTestExtensionExemptionById');
      const result = await controller.getTestExtensionExemption('1', '1');
      expect(result).toEqual(testExtExp);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('getTestExtensionExemptions', () => {
    it('should call the TestSummaryWorkspaceService.getTestExtensionExemptionsByLocationId', async () => {
      const spyService = jest.spyOn(
        service,
        'getTestExtensionExemptionsByLocationId',
      );
      const result = await controller.getTestExtensionExemptions('1');
      expect(result).toEqual([testExtExp]);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('createTestExtensionExemption', () => {
    it('should create test extension exemption record', async () => {
      const spyService = jest.spyOn(service, 'createTestExtensionExemption');
      const result = await controller.createTestExtensionExemption(
        '1',
        payload,
        user,
      );
      expect(result).toEqual(testExtExp);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('updateTestExtensionExemption', () => {
    it('should update test extension exemption record', async () => {
      const spyService = jest.spyOn(service, 'updateTestExtensionExemption');
      const result = await controller.updateTestExtensionExemption(
        '1',
        '1',
        payload,
        user,
      );
      expect(result).toEqual({});
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('deleteTestExtensionExemption', () => {
    it('should delete test extension exemption record', async () => {
      const spyService = jest.spyOn(service, 'deleteTestExtensionExemption');
      const result = await controller.deleteTestExtensionExemption('1', '1');
      expect(result).toEqual('');
      expect(spyService).toHaveBeenCalled();
    });
  });
});
