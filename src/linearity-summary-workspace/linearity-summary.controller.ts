import {
  Get,
  Put,
  Post,
  Body,
  Delete,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiSecurity,
} from '@nestjs/swagger';

//import { AuthGuard } from '@us-epa-camd/easey-common/guards';
//import { CurrentUser } from '@us-epa-camd/easey-common/decorators';

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
  async getLinearitySummaries(
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
  async getLinearitySummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<LinearitySummaryRecordDTO> {
    return this.service.getSummaryById(id);
  }

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: LinearitySummaryRecordDTO,
    description: 'Creates a Linearity Summary record in the workspace',
  })
  async createLinearitySummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: LinearitySummaryBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<LinearitySummaryRecordDTO> {
    const userId = 'testUser';
    await this.checksService.runChecks(testSumId, payload);
    return this.service.createSummary(testSumId, payload, userId);
  }

  @Put(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: LinearitySummaryRecordDTO,
    description: 'Updates a Linearity Summary record in the workspace',
  })
  async updateLinearitySummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: LinearitySummaryBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<LinearitySummaryRecordDTO> {
    const userId = 'testUser';
    await this.checksService.runChecks(testSumId, payload, false, true);
    return this.service.updateSummary(testSumId, id, payload, userId);
  }

  @Delete(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Deletes a Linearity Summary record from the workspace',
  })
  async deleteLinearitySummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    //    @CurrentUser() userId: string,
  ): Promise<void> {
    const userId = 'testUser';
    return this.service.deleteSummary(testSumId, id, userId);
  }
}
