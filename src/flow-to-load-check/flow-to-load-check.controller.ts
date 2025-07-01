import { Controller, Param, Get } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { FlowToLoadCheckService } from './flow-to-load-check.service';
import { FlowToLoadCheckRecordDTO } from '../dto/flow-to-load-check.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Check')
@ApiExtraModels(FlowToLoadCheckRecordDTO)
export class FlowToLoadCheckController {
  constructor(private readonly service: FlowToLoadCheckService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Flow To Load Check records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(FlowToLoadCheckRecordDTO) },
              },
            },
          },
        },
      }
  })
  async getFlowToLoadChecks(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<FlowToLoadCheckRecordDTO>> {
    const flowToLoadCheckRecordDTOS =  await this.service.getFlowToLoadChecks(testSumId);

    return  {
      items: flowToLoadCheckRecordDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowToLoadCheckRecordDTO,
    description: 'Retrieves a Flow To Load Check record by its Id',
  })
  async getFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadCheckRecordDTO> {
    return this.service.getFlowToLoadCheck(id);
  }
}
