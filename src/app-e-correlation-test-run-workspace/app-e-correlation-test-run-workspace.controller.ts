import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunRecordDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Run')
export class AppECorrelationTestRunWorkspaceController {
  constructor(
    private readonly service: AppECorrelationTestRunWorkspaceService,
  ) {}

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: AppECorrelationTestRunRecordDTO,
    description: 'Creates a workspace Appendix E Correlation Test Run record.',
  })
  async createAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
    @Body() payload: AppECorrelationTestRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppECorrelationTestRunRecordDTO> {
    return this.service.createAppECorrelationTestRun(
      testSumId,
      appECorrTestSumId,
      payload,
      user.userId,
    );
  }
}
