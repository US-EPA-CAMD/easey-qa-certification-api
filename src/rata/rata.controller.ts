import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RataRecordDTO } from '../dto/rata.dto';
import { RataService } from './rata.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Rata')
export class RataController {
  constructor(private readonly service: RataService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: RataRecordDTO,
    description: 'Retrieves workspace RATA records by Test Summary Id',
  })
  async getRatas(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<RataRecordDTO[]> {
    return this.service.getRatasByTestSumId(testSumId);
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
