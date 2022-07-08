import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';

describe('Linearity Summary Check Service Test', () => {
  let service: LinearitySummaryChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearitySummaryChecksService,
        LinearitySummaryWorkspaceRepository,
      ],
    }).compile();

    service = module.get(LinearitySummaryChecksService);
  });

  // TEST-7 Test Dates Consistent
  describe('To be defined', () => {
    it('To be defined', () => {
      expect(service).toBeDefined();
    });
  });
});
