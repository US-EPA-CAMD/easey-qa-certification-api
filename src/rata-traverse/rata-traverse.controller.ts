import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { RataTraverseRecordDTO } from '../dto/rata-traverse.dto';
import { RataTraverseService } from './rata-traverse.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata Traverse')
@ApiExtraModels(RataTraverseRecordDTO)
export class RataTraverseController {
  constructor(private readonly service: RataTraverseService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official Rata Traverse records by Flow Rata Run ID',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(RataTraverseRecordDTO) },
              },
            },
          },
        },
      }
  })
  async getRataTraverses(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('flowRataRunId') flowRataRunId: string,
  ): Promise<ArrayResponse<RataTraverseRecordDTO>> {
    const rataTraverseRecordDTOS =  await  this.service.getRataTraverses(flowRataRunId);

    return  {
      items: rataTraverseRecordDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: RataTraverseRecordDTO,
    description: 'Retrieves official Rata Traverse record by its Id',
  })
  async getRataTraverse(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('rataId') _rataId: string,
    @Param('rataSumId') _rataSumId: string,
    @Param('rataRunId') _rataRunId: string,
    @Param('flowRataRunId') _flowRataRunId: string,
    @Param('id') id: string,
  ): Promise<RataTraverseRecordDTO> {
    return this.service.getRataTraverse(id);
  }
}
