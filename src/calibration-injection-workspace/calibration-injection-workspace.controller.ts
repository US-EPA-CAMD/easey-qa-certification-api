import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
