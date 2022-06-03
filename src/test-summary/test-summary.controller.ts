import {
  Get,
  Query,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { TestSummaryRecordDTO } from '../dto/test-summary.dto';
import { TestSummaryParamsDTO } from '../dto/test-summary-params.dto';
import { TestSummaryService } from './test-summary.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Summary')
export class TestSummaryController {
  
  constructor(
    private readonly service: TestSummaryService
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TestSummaryRecordDTO,
    description: 'Retrieves official Test Summary records per filter criteria',
  })
  async getTestSummaries(
    @Param('locId') locationId: string,
    @Query() params: TestSummaryParamsDTO,
  ): Promise<TestSummaryRecordDTO[]> {
    return this.service.getTestSummariesByLocationId(locationId, params);
  }

  @Get(':id')
  @ApiOkResponse({
    type: TestSummaryRecordDTO,
    description: 'Retrieves official Test Summary record by its id',
  })
  async getTestSummary(
    @Param('locId') locationId: string,
    @Param('id') testSumId: string,
  ): Promise<TestSummaryRecordDTO> {
    return this.service.getTestSummaryById(locationId, testSumId);
  }
}
