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
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataChecksService } from './rata-checks.service';
import { RataWorkspaceService } from './rata-workspace.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata')
@ApiExcludeControllerByEnv()
@ApiExtraModels(RataRecordDTO)
export class RataWorkspaceController {
  constructor(
    private readonly service: RataWorkspaceService,
    private readonly checksService: RataChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves workspace RATA records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(RataRecordDTO) },
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
    label: 'Retrieved RATA records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getRatas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<RataRecordDTO>> {
    const rataDTOS =  await  this.service.getRatasByTestSumId(testSumId);

    return  {
      items: rataDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    type: RataRecordDTO,
    description: 'Retrieves workspace RATA record by its Id',
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
    label: 'Retrieved RATA record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<RataRecordDTO> {
    return this.service.getRataById(id);
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
    type: RataRecordDTO,
    description: 'Creates a Rata record in the workspace',
  })
  @AuditLog({
    label: 'Created RATA record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  async createRata(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: RataBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataRecordDTO> {
    await this.checksService.runChecks(locationId, payload, testSumId);
    return this.service.createRata(testSumId, payload, user.userId);
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
    type: RataRecordDTO,
    description: 'Updates a Rata record in the workspace',
  })
  @AuditLog({
    label: 'Updated RATA record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  async updateRata(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: RataBaseDTO,
    @User() user: CurrentUser,
  ): Promise<RataRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      testSumId,
      false,
      true,
    );
    return this.service.updateRata(testSumId, id, payload, user.userId);
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
    description: 'Deletes a RATA record from the workspace',
  })
  @AuditLog({
    label: 'Deleted RATA record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteRata(testSumId, id, user.userId);
  }
}
