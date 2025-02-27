import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

import { MatsDataSubmissionDTO } from '../dto/mats-data-submission.dto';
import { MatsDataSubmissionService } from './mats-data-submission.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Data Submission')
export class MatsDataSubmissionController {
  constructor(private readonly service: MatsDataSubmissionService) {}

  @Get(':monPlanId')
  @ApiOkResponse({
    isArray: true,
    type: MatsDataSubmissionDTO,
    description:
      'Retrieves MATS Data Submission records for a given Monitoring Plan ID',
  })
  async getMatsDataSubmissions(
    @Param('monPlanId') monPlanId: string,
  ): Promise<ArrayResponse<MatsDataSubmissionDTO>> {
    const submissions = await this.service.getMatsDataSubmissions(monPlanId);

    return {
      items: submissions,
    };
  }
}
