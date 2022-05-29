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
  ApiQuery,
} from '@nestjs/swagger';

import { TestSummary } from '../entities/test-summary.entity';
import { TestSummaryDTO } from '../dto/test-summary.dto';
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
    description: 'Retrieves official Test Summary records per filter criteria',
  })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitId', required: false, explode: false, })
  @ApiQuery({ style: 'pipeDelimited', name: 'stackPipeId', required: false, explode: false, })
  async getTestSummaries(
    @Query() params: TestSummaryParamsDTO,
  ): Promise<TestSummary[]> {
    return this.service.getTestSummaries(params);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Retrieves an official Test Summary record by its id',
  })
  async getTestSummary(
    @Param('id') testSumId: string,
  ): Promise<TestSummary> {
    return this.service.getTestSummary(testSumId);
  }  
}
