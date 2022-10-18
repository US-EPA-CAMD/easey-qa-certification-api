import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
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
  async getFuelFlowToLoadBaselines(
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
  async getFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<CalibrationInjectionDTO> {
    return this.service.getCalibrationInjection(id, testSumId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
}
