import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';
import { MatsDataSubmissionChecksService } from './mats-data-submission-checks.service';

describe('MatsDataSubmissionChecksService', () => {
  let service: MatsDataSubmissionChecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        MatsDataSubmissionMap,
        MatsDataSubmissionRepository,
        MatsDataSubmissionService,
        MatsDataSubmissionChecksService,
      ],
    }).compile();

    service = module.get<MatsDataSubmissionChecksService>(MatsDataSubmissionChecksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

