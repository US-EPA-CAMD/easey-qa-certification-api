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
import {
  CalibrationInjectionBaseDTO,
  CalibrationInjectionDTO,
} from '../dto/calibration-injection.dto';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Calibration Injection')
@ApiExcludeControllerByEnv()
@ApiExtraModels(CalibrationInjectionDTO)
export class CalibrationInjectionWorkspaceController {
  constructor(private readonly service: CalibrationInjectionWorkspaceService) { }

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace Calibration Injection records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(CalibrationInjectionDTO) },
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
    label: 'Retrieved calibration injection records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getCalibrationInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<CalibrationInjectionDTO>> {
    const calibrationInjections = await this.service.getCalibrationInjections(testSumId);
    return { items: calibrationInjections };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: CalibrationInjectionDTO,
    description: 'Retrieves workspace Calibration Injection record by its Id',
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
    label: 'Retrieved calibration injection record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getCalibrationInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<CalibrationInjectionDTO> {
    return this.service.getCalibrationInjection(id, testSumId);
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
    type: CalibrationInjectionDTO,
    description: 'Creates a workspace Calibration Injection record.',
  })
  @AuditLog({
    label: 'Created calibration injection record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  createCalibrationInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: CalibrationInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CalibrationInjectionDTO> {
    return this.service.createCalibrationInjection(
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
    type: CalibrationInjectionDTO,
    description: 'Updates a workspace Calibration Injection record.',
  })
  @AuditLog({
    label: 'Updated calibration injection record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  updateCalibrationInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: CalibrationInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CalibrationInjectionDTO> {
    return this.service.updateCalibrationInjection(
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
    description: 'Deletes a workspace Calibration Injection record.',
  })
  @AuditLog({
    label: 'Deleted calibration injection record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteCalibrationInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteCalibrationInjection(testSumId, id, user.userId);
  }
}
