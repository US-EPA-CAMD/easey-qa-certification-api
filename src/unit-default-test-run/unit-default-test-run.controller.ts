import { UnitDefaultTestRunService } from './unit-default-test-run.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitDefaultTestRunDTO } from '../dto/unit-default-test-run.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Default Test Run')
export class UnitDefaultTestRunController {
  constructor(private readonly service: UnitDefaultTestRunService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitDefaultTestRunDTO,
    description:
      'Retrieves official Unit Default Test Run records by Unit Default Test Summary Id',
  })
  async getUnitDefaultTestRuns(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('unitDefaultTestSumId') unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunDTO[]> {
    return this.service.getUnitDefaultTestRuns(unitDefaultTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: UnitDefaultTestRunDTO,
    description: 'Retrieves official Unit Default Test Run record by its Id',
  })
  async getUnitDefaultTestRun(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('unitDefaultTestSumId') unitDefaultTestSumId: string,
    @Param('id') id: string,
  ): Promise<UnitDefaultTestRunDTO> {
    return this.service.getUnitDefaultTestRun(id, unitDefaultTestSumId);
  }
}
