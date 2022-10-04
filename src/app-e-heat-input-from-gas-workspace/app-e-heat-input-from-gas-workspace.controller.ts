import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
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
  AppEHeatInputFromGasBaseDTO,
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasRecordDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Heat Input From Gas')
export class AppEHeatInputFromGasWorkspaceController {
  constructor(private readonly service: AppEHeatInputFromGasWorkspaceService) {}

  @Post()
  @ApiBearerAuth('Token')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: AppEHeatInputFromGasDTO,
    description: 'Creates a workspace Appendix E Heat Input From Gas record.',
  })
  async createAppEHeatInputFromGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('appEHeatInputFromGasId') appEHeatInputFromGasId: string,
    @Body() payload: AppEHeatInputFromGasBaseDTO,
    @User() user: CurrentUser,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    return this.service.createAppEHeatInputFromGas(
      testSumId,
      appEHeatInputFromGasId,
      payload,
      user.userId,
    );
  }
}
