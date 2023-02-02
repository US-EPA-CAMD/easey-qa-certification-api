import {
  Get,
  Put,
  Post,
  Body,
  Delete,
  Controller,
  Param,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiSecurity,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  LinearitySummaryBaseDTO,
  LinearitySummaryRecordDTO,
} from '../dto/linearity-summary.dto';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Summary')
export class LinearitySummaryWorkspaceController {
  constructor(
    private readonly service: LinearitySummaryWorkspaceService,
    private readonly checksService: LinearitySummaryChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LinearitySummaryRecordDTO,
    description:
      'Retrieves workspace Linearity Summary records by Test Summary Id',
  })
  async getSummariesByTestSumId(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<LinearitySummaryRecordDTO[]> {
    return this.service.getSummariesByTestSumId(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: LinearitySummaryRecordDTO,
    description: 'Retrieves workspace Linearity Summary record by its Id',
  })
  async getSummaryById(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<LinearitySummaryRecordDTO> {
    return this.service.getSummaryById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: LinearitySummaryRecordDTO,
    description: 'Creates a Linearity Summary record in the workspace',
  })
  async createSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: LinearitySummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LinearitySummaryRecordDTO> {
    await this.checksService.runChecks(payload, testSumId);
    return this.service.createSummary(testSumId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: LinearitySummaryRecordDTO,
    description: 'Updates a Linearity Summary record in the workspace',
  })
  async updateSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: LinearitySummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LinearitySummaryRecordDTO> {
    await this.checksService.runChecks(payload, testSumId, false, true);
    return this.service.updateSummary(testSumId, id, payload, user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    description: 'Deletes a Linearity Summary record from the workspace',
  })
  async deleteSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteSummary(testSumId, id, user.userId);
  }
}
