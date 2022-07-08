import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryWorkspaceRepository } from '../linearity-summary-workspace/linearity-summary.repository';
import { LinearityInjectionChecksService } from './linearity-injection-checks.service';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';

describe('Linearity Injection Check Service Test', () => {
  let service: LinearityInjectionChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearityInjectionChecksService,
        LinearityInjectionWorkspaceRepository,
        LinearitySummaryWorkspaceRepository,
      ],
    }).compile();

    service = module.get(LinearityInjectionChecksService);
  });

  describe('To be defined', () => {
    it('To be defined', () => {
      expect(service).toBeDefined();
    });
  });
});
