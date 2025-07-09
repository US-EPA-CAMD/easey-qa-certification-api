import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineService } from './fuel-flow-to-load-baseline.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Baseline')
@ApiExtraModels(FuelFlowToLoadBaselineDTO)
export class FuelFlowToLoadBaselineController {
  constructor(private readonly service: FuelFlowToLoadBaselineService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official Fuel Flow To Load Baseline records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(FuelFlowToLoadBaselineDTO) },
              },
            },
          },
        },
      }
  })
  async getFuelFlowToLoadBaselines(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<FuelFlowToLoadBaselineDTO>> {
    const loadBaselineDTOS =  await this.service.getFuelFlowToLoadBaselines(testSumId);

    return  {
      items: loadBaselineDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowToLoadBaselineDTO,
    description:
      'Retrieves official Fuel Flow To Load Baseline record by its Id',
  })
  async getFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return this.service.getFuelFlowToLoadBaseline(id, testSumId);
  }
}
