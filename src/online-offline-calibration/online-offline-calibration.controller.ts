import { Controller, Get, Param, } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { OnlineOfflineCalibrationService } from './online-offline-calibration.service';
import {
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Online Offline Calibration')
export class OnlineOfflineCalibrationController {
  constructor(
    private readonly service: OnlineOfflineCalibrationService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: OnlineOfflineCalibrationRecordDTO,
    description: 'Retrieves official Online Offline Calibration records by Test Summary Id',
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
    description: 'Retrieves official Online Offline Calibration record by its Id',
  })
  getOnlineOfflineCalibration(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getOnlineOfflineCalibration(id);
  }
}