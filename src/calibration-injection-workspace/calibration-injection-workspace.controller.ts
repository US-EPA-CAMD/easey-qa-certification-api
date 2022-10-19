import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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
  async getCalibrationInjection(
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

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
