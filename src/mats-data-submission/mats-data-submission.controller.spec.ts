import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MatsDataSubmissionController } from './mats-data-submission.controller';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';

describe('MatsDataSubmissionController', () => {
  let controller: MatsDataSubmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatsDataSubmissionController],
      providers: [
        EntityManager,
        MatsDataSubmissionMap,
        MatsDataSubmissionRepository,
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
