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

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Retrieves workspace Online Offline Calibration records by Test Summary Id',
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
  getOnlineOfflineCalibration(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getOnlineOfflineCalibration(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Creates an Online Offline Calibration record in the workspace',
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Delete a workspace Online Offline Calibration record',
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: OnlineOfflineCalibrationRecordDTO,
    description:
      'Updates an Online Offline Calibration record in the workspace',
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
