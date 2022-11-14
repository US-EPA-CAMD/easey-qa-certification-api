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

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: CycleTimeSummaryDTO,
    description: 'Updates a workspace Cycle Time Summary record.',
  })
  updateCycleTimeSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: CycleTimeSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CycleTimeSummaryDTO> {
    return this.service.updateCycleTimeSummary(
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
    description: 'Deletes a workspace Cycle Time Summary record.',
  })
  async deleteCycleTimeSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteCycleTimeSummary(testSumId, id, user.userId);
  }
}