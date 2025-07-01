import { Get, Controller, Param } from '@nestjs/common';

import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { LinearitySummaryRecordDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryService } from './linearity-summary.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Summary')
@ApiExtraModels(LinearitySummaryRecordDTO)
export class LinearitySummaryController {
  constructor(private readonly service: LinearitySummaryService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official Linearity Summary records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(LinearitySummaryRecordDTO) },
              },
            },
          },
        },
      }
  })
  async getLinearitySummaries(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<LinearitySummaryRecordDTO>> {
    const summaryDTOS =  await this.service.getSummariesByTestSumId(testSumId);

    return  {
      items: summaryDTOS
    };
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
