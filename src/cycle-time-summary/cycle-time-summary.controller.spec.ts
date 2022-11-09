import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeSummaryController } from './cycle-time-summary.controller';
import { CycleTimeSummaryService } from './cycle-time-summary.service';

describe('CycleTimeSummaryController', () => {
  let controller: CycleTimeSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CycleTimeSummaryController],
      providers: [CycleTimeSummaryService],
    }).compile();

    controller = module.get<CycleTimeSummaryController>(
      CycleTimeSummaryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
