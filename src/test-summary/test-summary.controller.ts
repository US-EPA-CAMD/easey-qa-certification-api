import { Get, Query, Controller, Param } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiSecurity, ApiQuery, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { TestSummaryRecordDTO } from '../dto/test-summary.dto';
import { TestSummaryParamsDTO } from '../dto/test-summary-params.dto';
import { TestSummaryService } from './test-summary.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Summary')
@ApiExtraModels(TestSummaryRecordDTO)
export class TestSummaryController {
  constructor(private readonly service: TestSummaryService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official Test Summary records per filter criteria',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(TestSummaryRecordDTO) },
              },
            },
          },
        },
      }
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'testTypeCodes',
    required: false,
    explode: false,
  })
  async getTestSummaries(
    @Param('locId') locationId: string,
    @Query() params: TestSummaryParamsDTO,
  ): Promise<ArrayResponse<TestSummaryRecordDTO>> {
    const testSummaryDTOS =  await  this.service.getTestSummariesByLocationId(
      locationId,
      params.testTypeCodes,
      params.systemTypeCodes,
      params.beginDate,
      params.endDate,
    );

    return  {
      items: testSummaryDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    type: TestSummaryRecordDTO,
    description: 'Retrieves official Test Summary record by its id',
  })
  async getTestSummary(
    @Param('locId') _locationId: string,
    @Param('id') testSumId: string,
  ): Promise<TestSummaryRecordDTO> {
    return this.service.getTestSummaryById(testSumId);
  }
}
