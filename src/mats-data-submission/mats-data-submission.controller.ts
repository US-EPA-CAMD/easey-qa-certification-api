import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

import { MatsDataSubmissionDTO } from '../dto/mats-data-submission.dto';
import { SplitQueryPipe } from '../pipes/split-query.pipe';
import { MatsDataSubmissionService } from './mats-data-submission.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('MATS Data Submission')
export class MatsDataSubmissionController {
  constructor(private readonly service: MatsDataSubmissionService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: MatsDataSubmissionDTO,
    description:
      'Retrieves MATS Data Submission records for a given Monitoring Plan ID',
  })
  async getMatsDataSubmissions(
    @Query('monPlanIds', SplitQueryPipe) monPlanIds: string[],
  ): Promise<ArrayResponse<MatsDataSubmissionDTO>> {
    const submissions = await this.service.getMatsDataSubmissions(monPlanIds);

    return {
      items: submissions,
    };
  }

  @Get(':submissionId')
  @ApiOkResponse({
    type: MatsDataSubmissionDTO,
    description: 'Retrieves a MATS Data Submission record by its ID',
  })
  async getMatsDataSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ): Promise<MatsDataSubmissionDTO> {
    return this.service.getMatsDataSubmission(submissionId);
  }
}
