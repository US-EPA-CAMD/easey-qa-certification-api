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

import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { OnlineOfflineCalibrationWorkspaceService } from '../online-offline-calibration-workspace/online-offline-calibration.service';
import {
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Online Offline Calibration')
export class OnlineOfflineCalibrationWorkspaceController {
  constructor(
    private readonly service: OnlineOfflineCalibrationWorkspaceService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Retrieves workspace Online Offline Calibration records by Test Summary Id',
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
    label: 'Retrieved online offline calibration records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  getOnlineOfflineCalibrations(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) {
    return this.service.getOnlineOfflineCalibrations(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Retrieves workspace Online Offline Calibration record by its Id',
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
    label: 'Retrieved online offline calibration record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  getOnlineOfflineCalibration(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getOnlineOfflineCalibration(id);
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
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Creates an Online Offline Calibration record in the workspace',
  })
  @AuditLog({
    label: 'Created online offline calibration record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  async createOnlineOfflineCalibration(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: OnlineOfflineCalibrationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<OnlineOfflineCalibrationRecordDTO> {
    return this.service.createOnlineOfflineCalibration(
      testSumId,
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
    description: 'Delete a workspace Online Offline Calibration record',
  })
  @AuditLog({
    label: 'Deleted online offline calibration record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteOnlineOfflineCalibration(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteOnlineOfflineCalibration(
      testSumId,
      id,
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
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Updates an Online Offline Calibration record in the workspace',
  })
  @AuditLog({
    label: 'Updated online offline calibration record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  async updateOnlineOfflineCalibration(
    @Param('locid') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: OnlineOfflineCalibrationBaseDTO,
    @User() user: CurrentUser,
  ) {
    return this.service.updateOnlineOfflineCalibration(
      testSumId,
      id,
      payload,
      user.userId,
    );
  }
}
