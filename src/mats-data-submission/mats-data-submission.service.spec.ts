import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MatsCodeMap } from '../maps/mats-code.map';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';

describe('MatsDataSubmissionService', () => {
  let service: MatsDataSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        MatsCodeMap,
        MatsDataSubmissionMap,
        MatsDataSubmissionRepository,
        MatsDataSubmissionService,
      ],
    }).compile();

    service = module.get<MatsDataSubmissionService>(MatsDataSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
