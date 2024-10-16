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
  CalibrationInjectionBaseDTO,
  CalibrationInjectionDTO,
} from '../dto/calibration-injection.dto';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Calibration Injection')
export class CalibrationInjectionWorkspaceController {
  constructor(private readonly service: CalibrationInjectionWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: CalibrationInjectionDTO,
    description:
      'Retrieves workspace Calibration Injection records by Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getCalibrationInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<CalibrationInjectionDTO[]> {
    return this.service.getCalibrationInjections(testSumId);
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
  async deleteCalibrationInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteCalibrationInjection(testSumId, id, user.userId);
  }
}
