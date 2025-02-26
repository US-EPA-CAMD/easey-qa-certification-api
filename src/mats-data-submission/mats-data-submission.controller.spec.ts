import { Test, TestingModule } from '@nestjs/testing';
import { MatsDataSubmissionController } from './mats-data-submission.controller';

describe('MatsDataSubmissionController', () => {
  let controller: MatsDataSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatsDataSubmissionController],
    }).compile();

    controller = module.get<MatsDataSubmissionController>(MatsDataSubmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
