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
import { OnlineOfflineCalibrationWorkspaceService } from '../online-offline-calibration-workspace/online-offline-calibration.service';
import {
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Online Offline Calibration')
export class OnlineOfflineCalibrationWorkspaceController {
  constructor(
    private readonly service: OnlineOfflineCalibrationWorkspaceService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Creates an Online Offline Calibration record in the workspace',
  })
  async create(
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
}
