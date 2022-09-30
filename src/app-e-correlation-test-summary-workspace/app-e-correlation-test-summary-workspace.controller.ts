import {
    Controller,
    Param,
    Post,
    Body,
  } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiSecurity,
    ApiTags,
  } from '@nestjs/swagger';
import { 
    AppECorrelationTestSummaryDTO,
    AppECorrelationTestSummaryBaseDTO,
    AppECorrelationTestSummaryRecordDTO
  } from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Summary')
export class AppendixETestSummaryWorkspaceController {
  constructor(private readonly service: AppECorrelationTestSummaryWorkspaceService) {}

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: AppECorrelationTestSummaryRecordDTO,
    description: 'Creates a workspace Appendix E Test Summary record.',
  })
  async createAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: AppECorrelationTestSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    return this.service.createAppECorrelation(_locationId, testSumId, payload, user.userId);
  }
}