import { Controller } from '@nestjs/common';

import { MatsDataSubmissionService } from './mats-data-submission.service';

@Controller('mats-data-submission')
export class MatsDataSubmissionController {
  constructor(private readonly service: MatsDataSubmissionService) {}
}
