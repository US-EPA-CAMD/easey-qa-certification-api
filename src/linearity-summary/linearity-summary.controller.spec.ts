import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { LinearitySummaryController } from './linearity-summary.controller';
import { LinearitySummaryService } from './linearity-summary.service';

describe('Linearity Summary Controller', () => {
  let controller: LinearitySummaryController;
  let service: LinearitySummaryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [LinearitySummaryController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: LinearitySummaryService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get(LinearitySummaryController);
    service = module.get(LinearitySummaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
