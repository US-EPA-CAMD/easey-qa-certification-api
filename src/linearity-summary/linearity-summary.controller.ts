import {
  Get,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { LinearitySummaryRecordDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryService } from './linearity-summary.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Summary')
export class LinearitySummaryController {
  
  constructor(
    private readonly service: LinearitySummaryService
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LinearitySummaryRecordDTO,
    description: 'Retrieves official Linearity Summary records by Test Summary Id',
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
    description: 'Retrieves official Linearity Summary record by its Id',
  })
  async getLinearitySummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<LinearitySummaryRecordDTO> {
    return this.service.getSummaryById(id);
  }  
}
