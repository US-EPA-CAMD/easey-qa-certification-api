import {
  Get,
  Post,
  Body,
  Query,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { TestSummaryBaseDTO, TestSummaryRecordDTO } from '../dto/test-summary.dto';
import { TestSummaryParamsDTO } from '../dto/test-summary-params.dto';
import { TestSummaryWorkspaceService } from './test-summary.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Summary')
export class TestSummaryWorkspaceController {
  
  constructor(
    private readonly service: TestSummaryWorkspaceService
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TestSummaryRecordDTO,
    description: 'Retrieves workspace Test Summary records per filter criteria',
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
    description: 'Retrieves workspace Test Summary record by its id',
  })
  async getTestSummary(
    @Param('locId') locationId: string,
    @Param('id') testSumId: string,
  ): Promise<TestSummaryRecordDTO> {
    return this.service.getTestSummaryById(locationId, testSumId);
  }

  @Post()
  @ApiOkResponse({
    type: TestSummaryRecordDTO,
    description: 'Creates a Test Summary record in the workspace',
  })
  async createTestSummary(
    @Param('locId') locationId: string,
    @Body() payload: TestSummaryBaseDTO,
  ): Promise<TestSummaryRecordDTO> {
    return this.service.createTestSummary(locationId, payload);
  }
}
