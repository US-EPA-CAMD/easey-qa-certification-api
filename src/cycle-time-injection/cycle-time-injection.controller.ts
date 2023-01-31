import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CycleTimeInjectionRecordDTO } from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionService } from './cycle-time-injection.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Cycle Time Injection')
export class CycleTimeInjectionController {
  constructor(private readonly service: CycleTimeInjectionService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: CycleTimeInjectionRecordDTO,
    description:
      'Retreives official Cycle Time Injection records by Cycle Time Summary Id',
  })
  async getCycleTimeInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('cycleTimeSumId') cycleTimeSumId: string,
  ): Promise<CycleTimeInjectionRecordDTO[]> {
    return this.service.getCycleTimeInjectionsByCycleTimeSumId(cycleTimeSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: CycleTimeInjectionRecordDTO,
    description: 'Retrieves workspace Cycle Time Injection record by its Id',
  })
  async getCycleTimeInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('cycleTimeSumId') _cycleTimeSumId: string,
    @Param('id') id: string,
  ): Promise<CycleTimeInjectionRecordDTO> {
    return this.service.getCycleTimeInjection(id);
  }
}
