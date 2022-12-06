import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ReviewAndSubmitMultipleParamsDTO } from '../dto/review-and-submit-multiple-params.dto';
import { ReviewAndSubmitService } from './review-and-submit.service';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Review & Submit')
export class ReviewAndSubmitController {
  constructor(private readonly service: ReviewAndSubmitService) {}

  @Get('test-summary')
  @ApiOkResponse({
    isArray: true,
    type: ReviewAndSubmitTestSummaryDTO,
    description:
      'Retrieves workspace test summary records given a list of oris codes and or mon plan ids',
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'orisCodes',
    required: true,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'monPlanIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'quarters',
    required: false,
    explode: false,
  })
  async getTestSummary(
    @Query() dto: ReviewAndSubmitMultipleParamsDTO,
  ): Promise<ReviewAndSubmitTestSummaryDTO[]> {
    return this.service.getTestSummaryRecords(
      dto.orisCodes,
      dto.monPlanIds,
      dto.quarters,
    );
  }
}
