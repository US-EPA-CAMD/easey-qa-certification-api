import { Injectable } from '@nestjs/common';

import { MatsDataSubmissionRepository } from './mats-data-submission.repository';

@Injectable()
export class MatsDataSubmissionService {
  constructor(private readonly repository: MatsDataSubmissionRepository) {}
}
