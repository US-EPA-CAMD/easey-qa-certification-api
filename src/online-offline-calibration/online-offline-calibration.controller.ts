import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { OnlineOfflineCalibrationService } from './online-offline-calibration.service';
import { OnlineOfflineCalibrationDTO, OnlineOfflineCalibrationRecordDTO } from '../dto/online-offline-calibration.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Online Offline Calibration')
export class OnlineOfflineCalibrationController {
  constructor(private readonly service: OnlineOfflineCalibrationService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Retrieves official Online Offline Calibration records by Test Summary Id',
  })
  async getOnlineOfflineCalibrations(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) : Promise<ArrayResponse<OnlineOfflineCalibrationDTO>>  {
    const onlineOfflineCalibrationDTOS = await this.service.getOnlineOfflineCalibrations(testSumId);

    return { items: onlineOfflineCalibrationDTOS };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Retrieves official Online Offline Calibration record by its Id',
  })
  getOnlineOfflineCalibration(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getOnlineOfflineCalibration(id);
  }
}
