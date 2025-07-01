import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { RataRecordDTO } from '../dto/rata.dto';
import { RataService } from './rata.service';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata')
@ApiExtraModels(RataRecordDTO)
export class RataController {
  constructor(private readonly service: RataService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrieves workspace RATA records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(RataRecordDTO) },
              },
            },
          },
        },
      }
  })
  async getRatas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<RataRecordDTO>> {
    const rataDTOS = await this.service.getRatasByTestSumId(testSumId);

    return  {
      items: rataDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    type: RataRecordDTO,
    description: 'Retrieves workspace RATA record by its Id',
  })
  async getRata(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<RataRecordDTO> {
    return this.service.getRataById(id);
  }
}
