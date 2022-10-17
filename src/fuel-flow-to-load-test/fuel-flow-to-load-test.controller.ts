import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FuelFlowToLoadTestDTO } from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Test')
export class FuelFlowToLoadTestController {
  constructor(private readonly service: FuelFlowToLoadTestService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FuelFlowToLoadTestDTO,
    description:
      'Retrieves official Fuel Flow To Load Test records by Test Summary Id',
  })
  async getFuelFlowToLoadTests(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowToLoadTestDTO[]> {
    return this.service.getFuelFlowToLoadTests(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowToLoadTestDTO,
    description: 'Retrieves official Fuel Flow To Load Test record by its Id',
  })
  async getFuelFlowToLoadTest(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowToLoadTestDTO> {
    return this.service.getFuelFlowToLoadTest(id, testSumId);
  }
}
