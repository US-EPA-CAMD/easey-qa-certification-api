import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
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

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppECorrelationTestRunRecordDTO,
    description:
      'Retrieves aworkspace Appendix E Correlation Test Run records by Appendix E Correlation Test Summary Id',
  })
  async getAppECorrelationTestRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
  ) {
    return this.service.getAppECorrelationTestRuns(appECorrTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppECorrelationTestRunRecordDTO,
    description:
      'Retrieves aworkspace Appendix E Correlation Test Run record by its unique Id',
  })
  async getAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppECorrelationTestRun(id);
  }

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
