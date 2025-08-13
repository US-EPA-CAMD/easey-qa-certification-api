import { Get, Controller, Param } from '@nestjs/common';

import { ApiTags, ApiOkResponse, ApiSecurity, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { LinearityInjectionRecordDTO } from '../dto/linearity-injection.dto';
import { LinearityInjectionService } from './linearity-injection.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Injection')
@ApiExtraModels(LinearityInjectionRecordDTO)
export class LinearityInjectionController {
  constructor(private readonly service: LinearityInjectionService) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves official Linearity Injection records by Linearity Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(LinearityInjectionRecordDTO) },
              },
            },
          },
        },
      }
  })
  async getInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') linSumId: string,
  ): Promise<ArrayResponse<LinearityInjectionRecordDTO>> {
    const injectionDTOS =  await this.service.getInjectionsByLinSumId(linSumId);

    return  {
      items: injectionDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    type: LinearityInjectionRecordDTO,
    description: 'Retrieves official Linearity Injection record by its Id',
  })
  async getInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
  ): Promise<LinearityInjectionRecordDTO> {
    return this.service.getInjectionById(id);
  }
}
