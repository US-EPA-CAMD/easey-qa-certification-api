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
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestRecordDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Default Test')
export class UnitDefaultTestWorkspaceController {
  constructor(private readonly service: UnitDefaultTestWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitDefaultTestRecordDTO,
    description:
      'Retrieves workspace Unit Default Test records by Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getUnitDefaultTests(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<UnitDefaultTestRecordDTO[]> {
    return this.service.getUnitDefaultTests(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: UnitDefaultTestRecordDTO,
    description: 'Retrieves workspace Unit Default Test record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<UnitDefaultTestRecordDTO> {
    return this.service.getUnitDefaultTest(id);
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
    type: UnitDefaultTestRecordDTO,
    description: 'Creates a workspace Unit Default Test record.',
  })
  createUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: UnitDefaultTestBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitDefaultTestRecordDTO> {
    return this.service.createUnitDefaultTest(testSumId, payload, user.userId);
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
    isArray: true,
    type: UnitDefaultTestRecordDTO,
    description: 'Updates workspace Unit Default Test record',
  })
  updateUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: UnitDefaultTestBaseDTO,
    @User() user: CurrentUser,
  ): Promise<UnitDefaultTestRecordDTO> {
    return this.service.updateUnitDefaultTest(
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
    description: 'Deletes a unit default test record from the workspace',
  })
  async deleteUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteUnitDefaultTest(testSumId, id, user.userId);
  }
}
