import { Test, TestingModule } from '@nestjs/testing';
import { RataSummaryController } from './rata-summary.controller';
import { RataSummaryService } from './rata-summary.service';

const mockService = () => ({});

describe('RataSummaryController', () => {
  let controller: RataSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataSummaryController],
      providers: [
        {
          provide: RataSummaryService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<RataSummaryController>(RataSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
