import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
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
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionRecordDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionWorkspaceService } from './cycle-time-injection-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Cycle Time Injection')
export class CycleTimeInjectionWorkspaceController {
  constructor(private readonly service: CycleTimeInjectionWorkspaceService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: CycleTimeInjectionRecordDTO,
    description: 'Creates a Cycle Time Injection record in the workspace',
  })
  async createCycleTimeInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('cycleTimeSumId') cycleTimeSumId: string,
    @Body() payload: CycleTimeInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CycleTimeInjectionRecordDTO> {
    return this.service.createCycleTimeInjection(
      testSumId,
      cycleTimeSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: CycleTimeInjectionRecordDTO,
    description: ' Updates a Cycle Time Injection record in the workspace',
  })
  async updateCycleTimeInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('cycleTimeSumId') _cycleTimeSumId: string,
    @Param('id') id: string,
    @Body() payload: CycleTimeInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CycleTimeInjectionRecordDTO> {
    return this.service.updateCycleTimeInjection(
      testSumId,
      id,
      payload,
      user.userId,
    );
  }
}
