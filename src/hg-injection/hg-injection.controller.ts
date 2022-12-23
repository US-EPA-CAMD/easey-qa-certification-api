import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HgInjectionDTO } from 'src/dto/hg-injection.dto';
import { HgInjectionService } from './hg-injection.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Injection')
export class HgInjectionController {
  constructor(private readonly service: HgInjectionService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: HgInjectionDTO,
    description: 'Retrieves workspace Hg Injection records by Test Summary Id',
  })
  async getHgInjections(
    @Param('locId') _locationId: string,
    @Param('hgTestSumId') hgTestSumId: string,
  ): Promise<HgInjectionDTO[]> {
    return this.service.getHgInjections(hgTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: HgInjectionDTO,
    description: 'Retrieves Injection Hg Injection record by its Id',
  })
  async getHgInjection(
    @Param('locId') _locationId: string,
    @Param('hgTestSumId') hgTestSumId: string,
    @Param('id') id: string,
  ): Promise<HgInjectionDTO> {
    return this.service.getHgInjection(id, hgTestSumId);
  }
}
