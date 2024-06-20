import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  AppEHeatInputFromOilBaseDTO,
  AppEHeatInputFromOilRecordDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOilWorkspaceService } from './app-e-heat-input-from-oil.service';
import { AppEHeatInputFromOilChecksService } from './app-e-heat-input-from-oil-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Heat Input From Oil')
export class AppEHeatInputFromOilWorkspaceController {
  constructor(
    private readonly service: AppEHeatInputFromOilWorkspaceService,
    private readonly checksService: AppEHeatInputFromOilChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppEHeatInputFromOilRecordDTO,
    description:
      'Retrieves workspace Appendix E Heat Input from Oil records by Appendix E CorrelationTestRun Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
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
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
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
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
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
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: AppEHeatInputFromOilRecordDTO,
    description:
      'Updates an Appendix E Heat Input from Oil record in the workspace',
  })
  async editAppEHeatInputFromOil(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _aeCorrTestSumId: string,
    @Param('appECorrTestRunId') aeCorrTestRunId: string,
    @Param('id') id: string,
    @Body() payload: AppEHeatInputFromOilBaseDTO,
    @User() user: CurrentUser,
  ) {
    await this.checksService.runChecks(payload, id, aeCorrTestRunId);
    return this.service.updateAppEHeatInputFromOilRecord(
      locationId,
      testSumId,
      id,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
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
