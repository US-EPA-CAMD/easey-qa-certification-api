import { Test, TestingModule } from '@nestjs/testing';
import { TestExtensionExemptionsController } from './test-extension-exemptions.controller';
import { TestExtensionExemptionsService } from './test-extension-exemptions.service';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TestExtensionExemptionRecordDTO } from '../dto/test-extension-exemption.dto';

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const testExtExp = new TestExtensionExemptionRecordDTO();

const mockTestExtensionExemptionService = () => ({
  getTestExtensionExemptionById: jest.fn().mockResolvedValue(testExtExp),
  getTestExtensionExemptionsByLocationId: jest
    .fn()
    .mockResolvedValue([testExtExp]),
});

describe('TestExtensionExemptionsController', () => {
  let controller: TestExtensionExemptionsController;
  let service: TestExtensionExemptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [TestExtensionExemptionsController],
      providers: [
        ConfigService,
        AuthGuard,

        {
          provide: TestExtensionExemptionsService,
          useFactory: mockTestExtensionExemptionService,
        },
      ],
    }).compile();

    controller = module.get<TestExtensionExemptionsController>(
      TestExtensionExemptionsController,
    );
    service = module.get(TestExtensionExemptionsService);
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

  describe('getTestExtensionExemptionsByLocationId', () => {
    it('should call the QaTestExtensionExemptionsWorkshopService.getTestExtensionExemptions', async () => {
      const spyService = jest.spyOn(
        service,
        'getTestExtensionExemptionsByLocationId',
      );
      const result = await controller.getTestExtensionExemptions('1');
      expect(result).toEqual([testExtExp]);
      expect(spyService).toHaveBeenCalled();
    });
  });
});
