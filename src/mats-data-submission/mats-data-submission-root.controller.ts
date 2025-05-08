import { Get, Query, Controller } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery } from '@nestjs/swagger';
import { AuditLog, RoleGuard } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { MatsDataSubmissionDTO } from '../dto/mats-data-submission.dto';
import { SplitQueryPipe } from '../pipes/split-query.pipe';
import { MatsDataSubmissionService } from './mats-data-submission.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
@ApiExcludeControllerByEnv()
export class MatsDataSubmissionRootController {
  constructor(private readonly service: MatsDataSubmissionService) {}

  @Get('mats-data-submission')
  @ApiOkResponse({
    isArray: true,
    type: MatsDataSubmissionDTO,
    description:
      'Retrieves MATS Data Submission records for a given Monitoring Plan ID',
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: true,
    explode: false,
  })
  @RoleGuard(
    {
      queryParam: 'monPlanIds',
      isPipeDelimitted: true,
      enforceEvalSubmitCheck: false,
    },
    LookupType.MonitorPlan,
  )
  @AuditLog({
    label: 'Retrieved MATS Data Submission records',
    requestQueryOutFields: ['monPlanIds'],
  })
  async getMatsDataSubmissions(
    @Query('monPlanIds', SplitQueryPipe) monPlanIds: string[],
  ): Promise<ArrayResponse<MatsDataSubmissionDTO>> {
    const submissions = await this.service.getMatsDataSubmissions(monPlanIds);

    return {
      items: submissions,
    };
  }
}
