import { Test, TestingModule } from '@nestjs/testing';
import { MatsDataSubmissionService } from './mats-data-submission.service';

describe('MatsDataSubmissionService', () => {
  let service: MatsDataSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatsDataSubmissionService],
    }).compile();

    service = module.get<MatsDataSubmissionService>(MatsDataSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
