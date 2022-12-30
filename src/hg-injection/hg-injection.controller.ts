import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HgInjectionRecordDTO } from '../dto/hg-injection.dto';
import { HgInjectionService } from './hg-injection.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Injection')
export class HgInjectionController {
  constructor(private readonly service: HgInjectionService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: HgInjectionRecordDTO,
    description: 'Retrieves Hg Injection records by Test Summary Id',
  })
  async getHgInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('hgTestSumId') hgTestSumId: string,
  ): Promise<HgInjectionRecordDTO[]> {
    return this.service.getHgInjectionsByHgTestSumId(hgTestSumId);
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
