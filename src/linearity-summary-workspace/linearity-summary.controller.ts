import {
  Get,
  Post,
  Body,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { LinearitySummaryBaseDTO, LinearitySummaryRecordDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Summary')
export class LinearitySummaryWorkspaceController {
  
  constructor(
    private readonly service: LinearitySummaryWorkspaceService
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LinearitySummaryRecordDTO,
    description: 'Retrieves workspace Linearity Summary records',
  })
  async getLinearitySummaries(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<LinearitySummaryRecordDTO[]> {
    return this.service.getLinearitySummariesByTestSumId(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: LinearitySummaryRecordDTO,
    description: 'Retrieves workspace Linearity Summary record by its id',
  })
  async getLinearitySummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<LinearitySummaryRecordDTO> {
    return this.service.getLinearitySummaryById(id);
  }

  @Post()
  @ApiOkResponse({
    type: LinearitySummaryRecordDTO,
    description: 'Creates a Linearity Summary record in the workspace',
  })
  async createLinearitySummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Body() _payload: LinearitySummaryBaseDTO,
  ): Promise<LinearitySummaryRecordDTO> {
    return;//this.service.createLinearitySummary(locationId, payload);
  }
}
