import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Post,
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
  AppEHeatInputFromOilBaseDTO,
  AppEHeatInputFromOilRecordDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOilWorkspaceService } from './app-e-heat-input-from-oil.service';
import {AppEHeatInputFromOilChecksService} from "./app-e-heat-input-from-oil-checks.service";

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Heat Input From Oil')
export class AppEHeatInputFromOilWorkspaceController {
  constructor(
      private readonly service: AppEHeatInputFromOilWorkspaceService,
      private readonly checksService: AppEHeatInputFromOilChecksService
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppEHeatInputFromOilRecordDTO,
    description:
      'Retrieves workspace Appendix E Heat Input from Oil records by Appendix E CorrelationTestRun Id',
  })
  getAppEHeatInputFromOilRecords(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromOilRecordDTO[]> {
    return this.service.getAppEHeatInputFromOilRecords(appECorrTestRunId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppEHeatInputFromOilRecordDTO,
    description:
      'Retrieves workspace Appendix E Heat Input from Oil record by its Id',
  })
  getAppEHeatInputFromOilRecord(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppEHeatInputFromOilRecord(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: AppEHeatInputFromOilRecordDTO,
    description:
      'Creates an Appendix E Heat Input from Oil record in the workspace',
  })
  async createAppEHeatInputFromOilRecord(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _aeCorrTestSumId: string,
    @Param('appECorrTestRunId') aeCorrTestRunId: string,
    @Body() payload: AppEHeatInputFromOilBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppEHeatInputFromOilRecordDTO> {
    await this.checksService.runChecks(payload, null, aeCorrTestRunId);
    return this.service.createAppEHeatInputFromOilRecord(
      locationId,
      testSumId,
      aeCorrTestRunId,
      payload,
      user.userId,
      false,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: AppEHeatInputFromOilRecordDTO,
    description:
      'Updates an Appendix E Heat Input from Oil record in the workspace',
  })
  async editAppEHeatInputFromOil(
    @Param('locid') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _aeCorrTestSumId: string,
    @Param('appECorrTestRunId') aeCorrTestRunId: string,
    @Param('id') id: string,
    @Body() payload: AppEHeatInputFromOilBaseDTO,
    @User() user: CurrentUser,
  ) {
    await this.checksService.runChecks(payload, id, aeCorrTestRunId);
    return this.service.updateAppEHeatInputFromOilRecord(
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
  async deleteAppEHeatInputFromOil(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteAppEHeatInputFromOil(testSumId, id, user.userId);
  }
}
