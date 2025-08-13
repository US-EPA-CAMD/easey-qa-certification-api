import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { ProtocolGasDTO, ProtocolGasRecordDTO } from '../dto/protocol-gas.dto';
import { ProtocolGasService } from './protocol-gas.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@ApiTags('Protocol Gas')
@ApiSecurity('APIKey')
@Controller()
@ApiExtraModels(ProtocolGasDTO)
export class ProtocolGasController {
  constructor(private readonly service: ProtocolGasService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves official Protocol Gas records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(ProtocolGasDTO) },
              },
            },
          },
        },
      }
  })
  async getProtocolGases(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) : Promise<ArrayResponse<ProtocolGasDTO>>  {
    const protocolGasDTOS = await this.service.getProtocolGases(testSumId);

    return { items: protocolGasDTOS };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: ProtocolGasRecordDTO,
    description: 'Retrieves official Protocol Gas record by its Id',
  })
  getProtocolGas(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getProtocolGas(id);
  }
}
