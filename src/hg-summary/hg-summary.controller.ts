import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummaryService } from './hg-summary.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Summary')
@ApiExtraModels(HgSummaryDTO)
export class HgSummaryController {
  constructor(private readonly service: HgSummaryService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves workspace Hg Summary records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(HgSummaryDTO) },
              },
            },
          },
        },
      }
  })
  async getHgSummaries(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<HgSummaryDTO>> {
    const hgSummaryDTOS =  await this.service.getHgSummaries(testSumId);

    return  {
      items: hgSummaryDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: HgSummaryDTO,
    description: 'Retrieves workspace Hg Summary record by its Id',
  })
  async getHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<HgSummaryDTO> {
    return this.service.getHgSummary(id, testSumId);
  }
}
