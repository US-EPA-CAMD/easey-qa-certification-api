import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { CalibrationInjectionService } from './calibration-injection.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Calibration Injection')
export class CalibrationInjectionController {
  constructor(private readonly service: CalibrationInjectionService) {}

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
  ): Promise<ArrayResponse<CalibrationInjectionDTO>> {
    const calibrationInjections =  await this.service.getCalibrationInjections(testSumId);

    return  {
      items: calibrationInjections
    };
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
}
