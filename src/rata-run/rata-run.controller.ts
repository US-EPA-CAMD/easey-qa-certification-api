import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { RataRunDTO } from '../dto/rata-run.dto';
import { RataRunService } from './rata-run.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Run')
@ApiExtraModels(RataRunDTO)
export class RataRunController {
  constructor(private readonly service: RataRunService) {}
  @Get()
  @ApiOkResponse({
    description: 'Retrieves official Rata Run records by Rata Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(RataRunDTO) },
              },
            },
          },
        },
      }
  })
  async getRataRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') rataSumId: string,
  ): Promise<ArrayResponse<RataRunDTO>> {
    const rataRunDTOS = await this.service.getRataRuns(rataSumId);

    return  {
      items: rataRunDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: RataRunDTO,
    description: 'Retrieves official Rata Run record by its Id',
  })
  async getRataRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') rataRunId: string,
  ): Promise<RataRunDTO> {
    return this.service.getRataRun(rataRunId);
  }
}
