import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { HgInjectionRecordDTO } from '../dto/hg-injection.dto';
import { HgInjectionService } from './hg-injection.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Injection')
@ApiExtraModels(HgInjectionRecordDTO)
export class HgInjectionController {
  constructor(private readonly service: HgInjectionService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves Hg Injection records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(HgInjectionRecordDTO) },
              },
            },
          },
        },
      }
  })
  async getHgInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('hgTestSumId') hgTestSumId: string,
  ): Promise<ArrayResponse<HgInjectionRecordDTO>> {
    const hgInjectionDTOS =  await this.service.getHgInjectionsByHgTestSumId(hgTestSumId);

    return  {
      items: hgInjectionDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: HgInjectionRecordDTO,
    description: 'Retrieves Injection Hg Injection record by its Id',
  })
  async getHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('hgTestSumId') _hgTestSumId: string,
    @Param('id') id: string,
  ): Promise<HgInjectionRecordDTO> {
    return this.service.getHgInjection(id);
  }
}
