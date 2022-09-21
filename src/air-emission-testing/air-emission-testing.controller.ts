import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AirEmissionTestingDTO } from '../dto/air-emission-test.dto';
import { AirEmissionTestingService } from './air-emission-testing.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Air Emission Testing')
export class AirEmissionTestingController {
  constructor(private readonly service: AirEmissionTestingService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: AirEmissionTestingDTO,
    description:
      'Retrieves official Air Emission Testing records by Rata Summary Id',
  })
  async getAirEmissionsTestings(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<AirEmissionTestingDTO[]> {
    return this.service.getAirEmissionsTestings(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: AirEmissionTestingDTO,
    description: 'Retrieves official Air Emission Testing record by its Id',
  })
  async getAirEmissionsTesting(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<AirEmissionTestingDTO> {
    return this.service.getAirEmissionsTesting(id);
  }
}
