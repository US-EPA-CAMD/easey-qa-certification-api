import { UnitDefaultTestService } from './unit-default-test.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnitDefaultTestRecordDTO } from '../dto/unit-default-test.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Unit Default Test')
export class UnitDefaultTestController {
  constructor(private readonly service: UnitDefaultTestService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UnitDefaultTestRecordDTO,
    description:
      'Retrieves official Unit Default Test records by Test Summary Id',
  })
  async getUnitDefaultTests(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<UnitDefaultTestRecordDTO>> {
    const unitDefaultTestRecordDTOS =  await  this.service.getUnitDefaultTests(testSumId);

    return  {
      items: unitDefaultTestRecordDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: UnitDefaultTestRecordDTO,
    description: 'Retrieves official Unit Default Test record by its Id',
  })
  async getUnitDefaultTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<UnitDefaultTestRecordDTO> {
    return this.service.getUnitDefaultTest(id, testSumId);
  }
}
