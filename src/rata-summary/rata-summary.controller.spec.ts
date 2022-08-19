import { Test, TestingModule } from '@nestjs/testing';
import { RataSummaryController } from './rata-summary.controller';
import { RataSummaryService } from './rata-summary.service';

describe('RataSummaryController', () => {
  let controller: RataSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataSummaryController],
      providers: [RataSummaryService],
    }).compile();

    controller = module.get<RataSummaryController>(RataSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
