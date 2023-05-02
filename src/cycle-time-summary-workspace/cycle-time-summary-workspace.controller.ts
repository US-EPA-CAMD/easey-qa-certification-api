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
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
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
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
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
  @RoleGuard(
    { enforceCheckout: false, pathParam: 'locId' },
    LookupType.Location,
  )
  async getCycleTimeSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<CycleTimeSummaryDTO> {
    return this.service.getCycleTimeSummary(id, testSumId);
  }

  @Post()
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
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
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
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
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
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
