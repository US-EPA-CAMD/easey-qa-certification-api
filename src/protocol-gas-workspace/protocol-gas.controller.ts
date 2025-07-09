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
  ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  ProtocolGasBaseDTO,
  ProtocolGasRecordDTO,
} from '../dto/protocol-gas.dto';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Protocol Gas')
@ApiExcludeControllerByEnv()
@ApiExtraModels(ProtocolGasRecordDTO)
export class ProtocolGasWorkspaceController {
  constructor(
    private readonly service: ProtocolGasWorkspaceService,
    private readonly checksService: ProtocolGasChecksService,
  ) { }

  @Get()
  @ApiOkResponse({
    description: 'Retrieves workspace Protocol Gas records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(ProtocolGasRecordDTO) },
              },
            },
          },
        },
      }
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
    label: 'Retrieved protocol gas records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getProtocolGases(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<ProtocolGasRecordDTO>> {
    const protocolGasDTOS =  await this.service.getProtocolGases(testSumId);

    return  {
      items: protocolGasDTOS
    };
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
  @AuditLog({
    label: 'Retrieved protocol gas record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: ProtocolGasRecordDTO,
    description: 'Creates a Protocol Gas record in the workspace',
  })
  @AuditLog({
    label: 'Created protocol gas record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: ProtocolGasRecordDTO,
    description: 'Updates a Protocol Gas record in the workspace',
  })
  @AuditLog({
    label: 'Updated protocol gas record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
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
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description: 'Deletes a Protocol Gas record from the workspace',
  })
  @AuditLog({
    label: 'Deleted protocol gas record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
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
