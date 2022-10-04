import {
  Body,
  Controller,
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
  AppEHeatInputOilBaseDTO,
  AppEHeatInputOilRecordDTO,
} from '../dto/app-e-heat-input-oil.dto';
import { AppEHeatInputOilWorkspaceService } from './app-e-heat-input-oil.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Heat Input Oil')
export class AppEHeatInputOilWorkspaceController {
  constructor(private readonly service: AppEHeatInputOilWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppEHeatInputOilRecordDTO,
    description: 'Retrieves workspace Appendix E Heat Input Oil records by Appendix E CorrelationTestRun Id',
  })
  getAppEHeatInputOilRecords(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
  ): Promise<AppEHeatInputOilRecordDTO[]> {
    return this.service.getAppEHeatInputOilRecords(appECorrTestRunId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppEHeatInputOilRecordDTO,
    description: 'Retrieves workspace Appendix E Heat Input Oil record by its Id',
  })
  getAppEHeatInputOilRecord(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
  ) {
    return this.service.getAppEHeatInputOilRecord(id);
  }

  @Post()
  //@UseGuards(AuthGuard)
  //@ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: AppEHeatInputOilRecordDTO,
    description: 'Creates an Appendix E Heat Input Oil record in the workspace',
  })
  async createAppEHeatInputOilRecord(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _aeCorrTestSumId: string,
    @Param('appECorrTestRunId') aeCorrTestRunId: string,
    @Body() payload: AppEHeatInputOilBaseDTO,
    //@User() user: CurrentUser,
  ): Promise<AppEHeatInputOilRecordDTO> {
    return this.service.createAppEHeatInputOilRecord(testSumId, aeCorrTestRunId, payload, 'fred');//user.userId);
  }

}
