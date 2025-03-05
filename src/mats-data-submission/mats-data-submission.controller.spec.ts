import { Test, TestingModule } from '@nestjs/testing';

import { MatsCodeMap } from '../maps/mats-code.map';
import { MatsDataSubmissionController } from './mats-data-submission.controller';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionService } from './mats-data-submission.service';

describe('MatsDataSubmissionController', () => {
  let controller: MatsDataSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatsDataSubmissionController],
      providers: [
        MatsCodeMap,
        MatsDataSubmissionMap,
        MatsDataSubmissionService,
      ],
    }).compile();

    controller = module.get<MatsDataSubmissionController>(
      MatsDataSubmissionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
