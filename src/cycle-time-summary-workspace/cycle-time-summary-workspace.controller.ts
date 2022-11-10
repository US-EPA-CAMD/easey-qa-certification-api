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
  CycleTimeSummaryBaseDTO,
  CycleTimeSummaryDTO,
} from '../dto/cycle-time-summary.dto';
import { CycleTimeSummaryWorkspaceService } from './cycle-time-summary-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Cycle Time Summary')
export class CycleTimeSummaryWorkspaceController {
  constructor(private readonly service: CycleTimeSummaryWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: CycleTimeSummaryDTO,
    description:
      'Retrieves workspace Cycle Time Summary records by Test Summary Id',
  })
  async getCycleTimeSummaries(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<CycleTimeSummaryDTO[]> {
    return this.service.getCycleTimeSummaries(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: CycleTimeSummaryDTO,
    description: 'Retrieves workspace Cycle Time Summary record by its Id',
  })
  async getCycleTimeSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<CycleTimeSummaryDTO> {
    return this.service.getCycleTimeSummary(id, testSumId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: CycleTimeSummaryDTO,
    description: 'Creates a workspace Cycle Time Summary record.',
  })
  createCycleTimeSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: CycleTimeSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CycleTimeSummaryDTO> {
    return this.service.createCycleTimeSummary(testSumId, payload, user.userId);
  }
}
