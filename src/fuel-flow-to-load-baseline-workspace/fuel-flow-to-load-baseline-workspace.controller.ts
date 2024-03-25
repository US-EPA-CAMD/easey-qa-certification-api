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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import {
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Baseline')
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
  async getFuelFlowToLoadBaselines(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO[]> {
    return this.service.getFuelFlowToLoadBaselines(testSumId);
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: FuelFlowToLoadBaselineDTO,
    description: 'Creates a workspace Fuel Flow To Load Baseline record.',
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: FuelFlowToLoadBaselineDTO,
    description: 'Updates a workspace Fuel Flow To Load Baseline record.',
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description:
      'Deletes a Fuel Flow To Load Baseline record from the workspace',
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
