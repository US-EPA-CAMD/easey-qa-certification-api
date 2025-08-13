import { Controller, Param, Get } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { FlowToLoadReferenceRecordDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceService } from './flow-to-load-reference.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Reference')
@ApiExtraModels(FlowToLoadReferenceRecordDTO)
export class FlowToLoadReferenceController {
  constructor(private readonly service: FlowToLoadReferenceService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Flow To Load Reference records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(FlowToLoadReferenceRecordDTO) },
              },
            },
          },
        },
      }
  })
  async getFlowToLoadReferences(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<FlowToLoadReferenceRecordDTO>> {
    const flowToLoadReferenceRecordDTOS =  await this.service.getFlowToLoadReferences(testSumId);

    return  {
      items: flowToLoadReferenceRecordDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowToLoadReferenceRecordDTO,
    description: 'Retrieves a Flow To Load Reference record by its Id',
  })
  async getFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadReferenceRecordDTO> {
    return this.service.getFlowToLoadReference(id);
  }
}
