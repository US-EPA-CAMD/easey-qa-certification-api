import { Controller, Param, Get } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AppECorrelationTestSummaryRecordDTO } from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Summary')
@ApiExtraModels(AppECorrelationTestSummaryRecordDTO)
export class AppendixETestSummaryController {
  constructor(private readonly service: AppECorrelationTestSummaryService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves Appendix E Correlation Test Summary records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(AppECorrelationTestSummaryRecordDTO) },
              },
            },
          },
        },
      }
  })
  async getAppECorrelations(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<AppECorrelationTestSummaryRecordDTO>> {
    const testSummaryRecordDTOS =  await this.service.getAppECorrelations(testSumId);

    return  {
      items: testSummaryRecordDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AppECorrelationTestSummaryRecordDTO,
    description:
      'Retrieves an Appendix E Correlation Test Summary record by its Id',
  })
  async getAppECorrelation(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    return this.service.getAppECorrelation(id);
  }
}
