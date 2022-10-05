import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
  AppEHeatInputFromGasBaseDTO,
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasRecordDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Heat Input From Gas')
export class AppEHeatInputFromGasWorkspaceController {
  constructor(private readonly service: AppEHeatInputFromGasWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppEHeatInputFromGasRecordDTO,
    description:
      'Retrieves a workspace Appendix E Heat Input From Gas records by Appendix E Correlation Test Run Id',
  })
  async getAppECorrelationTestRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
  ) {
    return this.service.getAppEHeatInputFromGases(appECorrTestRunId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppEHeatInputFromGasRecordDTO,
    description: `Retrieves a workspace Appendix E Heat Input From Gas record by it's Id`,
  })
  async getAppECorrelationTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppEHeatInputFromGas(id);
  }

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: AppEHeatInputFromGasDTO,
    description: 'Creates a workspace Appendix E Heat Input From Gas record.',
  })
  async createAppEHeatInputFromGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
    @Body() payload: AppEHeatInputFromGasBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    return this.service.createAppEHeatInputFromGas(
      testSumId,
      appECorrTestRunId,
      payload,
      user.userId,
    );
  }
}
