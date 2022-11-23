import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
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
  async getAppEHeatInputFromGases(
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
  async getAppEHeatInputFromGas(
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
    type: AppEHeatInputFromGasRecordDTO,
    description: 'Creates a workspace Appendix E Heat Input From Gas record.',
  })
  async createAppEHeatInputFromGas(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
    @Body() payload: AppEHeatInputFromGasBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    return this.service.createAppEHeatInputFromGas(
      locationId,
      testSumId,
      appECorrTestRunId,
      payload,
      user.userId,
      false,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: AppEHeatInputFromGasRecordDTO,
    description: 'Updates a workspace Appendix E Heat Input From Gas record.',
  })
  async updateAppEHeatInputFromGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
    @Body() payload: AppEHeatInputFromGasBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    return this.service.updateAppEHeatInputFromGas(
      testSumId,
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
  async deleteAppEHeatInputFromGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteAppEHeatInputFromGas(testSumId, id, user.userId);
  }
}
