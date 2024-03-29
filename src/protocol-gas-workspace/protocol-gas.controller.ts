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
  ProtocolGasBaseDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Protocol Gas')
export class ProtocolGasWorkspaceController {
  constructor(
    private readonly service: ProtocolGasWorkspaceService,
    private readonly checksService: ProtocolGasChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: ProtocolGasRecordDTO,
    description: 'Retrieves workspace Protocol Gas records by Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getProtocolGases(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ProtocolGasRecordDTO[]> {
    return this.service.getProtocolGases(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: ProtocolGasRecordDTO,
    description: 'Retrieves workspace Protocol Gas record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  getProtocolGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getProtocolGas(id);
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
    type: ProtocolGasRecordDTO,
    description: 'Creates a Protocol Gas record in the workspace',
  })
  async createProtocolGas(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: ProtocolGasBaseDTO,
    @User() user: CurrentUser,
  ): Promise<ProtocolGasRecordDTO> {
    await this.checksService.runChecks(
      payload,
      locationId,
      testSumId,
      false,
      true,
    );
    return this.service.createProtocolGas(testSumId, payload, user.userId);
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
    type: ProtocolGasRecordDTO,
    description: 'Updates a Protocol Gas record in the workspace',
  })
  async editProtolGas(
    @Param('locid') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: ProtocolGasBaseDTO,
    @User() user: CurrentUser,
  ) {
    await this.checksService.runChecks(
      payload,
      locationId,
      testSumId,
      false,
      true,
    );
    return this.service.updateProtocolGas(testSumId, id, payload, user.userId);
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
    description: 'Deletes a Protocol Gas record from the workspace',
  })
  deleteProtolGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteProtocolGas(testSumId, id, user.userId);
  }
}
