import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineService } from './fuel-flow-to-load-baseline.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Fuel Flow To Load Baseline')
export class FuelFlowToLoadBaselineController {
  constructor(private readonly service: FuelFlowToLoadBaselineService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FuelFlowToLoadBaselineDTO,
    description:
      'Retrieves official Fuel Flow To Load Baseline records by Test Summary Id',
  })
  async getFuelFlowToLoadBaselines(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO[]> {
    return this.service.getFuelFlowToLoadBaselines(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FuelFlowToLoadBaselineDTO,
    description:
      'Retrieves official Fuel Flow To Load Baseline record by its Id',
  })
  async getFuelFlowToLoadBaseline(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    return this.service.getFuelFlowToLoadBaseline(id, testSumId);
  }
}
