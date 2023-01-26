import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
import { AppECorrelationTestRunChecksService } from './app-e-correlation-test-run-checks.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Run')
export class AppECorrelationTestRunWorkspaceController {
  constructor(
    private readonly service: AppECorrelationTestRunWorkspaceService,
    private readonly checkService: AppECorrelationTestRunChecksService,
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
    await this.checkService.runChecks(payload, null, appECorrTestSumId, false);
    return this.service.createAppECorrelationTestRun(
      testSumId,
      appECorrTestSumId,
      payload,
      user.userId,
      false,
      null,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: AppECorrelationTestRunRecordDTO,
    description: 'Updates a workspace Appendix E Correlation Test Run record.',
  })
  async updateAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
    @Param('id') id: string,
    @Body() payload: AppECorrelationTestRunBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppECorrelationTestRunRecordDTO> {
    await this.checkService.runChecks(payload, id, appECorrTestSumId, false);
    return this.service.updateAppECorrelationTestRun(
      testSumId,
      appECorrTestSumId,
      id,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a workspace Appendix E Correlation Test Run record.',
  })
  async deleteAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') appECorrTestSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteAppECorrelationTestRun(
      testSumId,
      appECorrTestSumId,
      id,
      user.userId,
    );
  }
}
