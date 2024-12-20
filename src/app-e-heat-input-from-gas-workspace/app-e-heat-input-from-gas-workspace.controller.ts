import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  AppEHeatInputFromGasBaseDTO,
  AppEHeatInputFromGasRecordDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';
import { AppEHeatInputFromGasChecksService } from './app-e-heat-input-from-gas-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Heat Input From Gas')
export class AppEHeatInputFromGasWorkspaceController {
  constructor(
    private readonly service: AppEHeatInputFromGasWorkspaceService,
    private readonly checksService: AppEHeatInputFromGasChecksService,
  ) { }

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AppEHeatInputFromGasRecordDTO,
    description:
      'Retrieves a workspace Appendix E Heat Input From Gas records by Appendix E Correlation Test Run Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved appendix E heat input from gases for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId', 'appECorrTestRunId']
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
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved appendix E heat input from gas by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId', 'appECorrTestRunId', 'id']
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
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: AppEHeatInputFromGasRecordDTO,
    description: 'Creates a workspace Appendix E Heat Input From Gas record.',
  })
  @AuditLog({
    label: 'Created appendix E heat input from gas for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId', 'appECorrTestRunId'],
    responseBodyOutFields: '*'
  })
  async createAppEHeatInputFromGas(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') appECorrTestRunId: string,
    @Body() payload: AppEHeatInputFromGasBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    await this.checksService.runChecks(payload, null, appECorrTestRunId);
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
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: AppEHeatInputFromGasRecordDTO,
    description: 'Updates a workspace Appendix E Heat Input From Gas record.',
  })
  @AuditLog({
    label: 'Updated appendix E heat input from gas by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId', 'appECorrTestRunId', 'id'],
    responseBodyOutFields: '*'
  })
  async updateAppEHeatInputFromGas(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appECorrTestSumId') _appECorrTestSumId: string,
    @Param('appECorrTestRunId') _appECorrTestRunId: string,
    @Param('id') id: string,
    @Body() payload: AppEHeatInputFromGasBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    await this.checksService.runChecks(payload, null, _appECorrTestRunId);
    return this.service.updateAppEHeatInputFromGas(
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description: 'Deletes a workspace Appendix E Correlation Test Run record.',
  })
  @AuditLog({
    label: 'Deleted appendix E heat input from gas by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'appECorrTestSumId', 'appECorrTestRunId', 'id']
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
