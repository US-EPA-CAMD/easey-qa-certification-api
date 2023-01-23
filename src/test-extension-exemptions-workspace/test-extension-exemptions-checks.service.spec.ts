import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { TestExtensionExemptionBaseDTO } from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionsChecksService } from './test-extension-exemptions-checks.service';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

const locationId = '';
const payload = new TestExtensionExemptionBaseDTO();
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([]),
});

const mockService = () => ({
  lookupValues: jest
    .fn()
    .mockReturnValue([
      'reportPeriodId',
      'componentRecordId',
      'monitoringSystemRecordId',
    ]),
});

describe('TestExtensionExemptionsChecksService', () => {
  let service: TestExtensionExemptionsChecksService;
  let repository: TestExtensionExemptionsWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestExtensionExemptionsChecksService,
        {
          provide: TestExtensionExemptionsWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: TestExtensionExemptionsWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(TestExtensionExemptionsChecksService);
    repository = module.get(TestExtensionExemptionsWorkspaceRepository);

    jest.spyOn(service, 'getErrorMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Test Extension Exemptions Checks', () => {
    it('Should pass all checks', async () => {
      const result = await service.runChecks(locationId, payload, false, false);
      expect(result).toEqual([]);
    });
  });
});
