import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse, ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Baseline')
@ApiExcludeControllerByEnv()
export class FuelFlowToLoadBaselineWorkspaceController {
  constructor(
    private readonly service: FuelFlowToLoadBaselineWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FuelFlowToLoadBaselineDTO,
    description:
      'Retrieves workspace Fuel Flow To Load Baseline records by Test Summary Id',
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
    label: 'Retrieved fuel flow to load baseline records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getFuelFlowToLoadBaselines(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<FuelFlowToLoadBaselineDTO>> {
    const fuelFlowToLoadBaselines = await this.service.getFuelFlowToLoadBaselines(testSumId);
    return { items: fuelFlowToLoadBaselines };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowToLoadBaselineDTO,
    description:
      'Retrieves workspace Fuel Flow To Load Baseline record by its Id',
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
    label: 'Retrieved fuel flow to load baseline record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return this.service.getFuelFlowToLoadBaseline(id, testSumId);
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
    type: FuelFlowToLoadBaselineDTO,
    description: 'Creates a workspace Fuel Flow To Load Baseline record.',
  })
  @AuditLog({
    label: 'Created fuel flow to load baseline record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  async createFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FuelFlowToLoadBaselineBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return this.service.createFuelFlowToLoadBaseline(
      testSumId,
      payload,
      user.userId,
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
    type: FuelFlowToLoadBaselineDTO,
    description: 'Updates a workspace Fuel Flow To Load Baseline record.',
  })
  @AuditLog({
    label: 'Updated fuel flow to load baseline record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  updateFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: FuelFlowToLoadBaselineBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return this.service.updateFuelFlowToLoadBaseline(
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
    description:
      'Deletes a Fuel Flow To Load Baseline record from the workspace',
  })
  @AuditLog({
    label: 'Deleted fuel flow to load baseline record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFuelFlowToLoadBaseline(
      testSumId,
      id,
      user.userId,
    );
  }
}
