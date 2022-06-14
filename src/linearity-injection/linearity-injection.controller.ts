import {
  Get,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { LinearityInjectionRecordDTO } from '../dto/linearity-injection.dto';
import { LinearityInjectionService } from './linearity-injection.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Injection')
export class LinearityInjectionController {
  
  constructor(
    private readonly service: LinearityInjectionService
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LinearityInjectionRecordDTO,
    description: 'Retrieves official Linearity Injection records by Linearity Summary Id',
  })
  async getInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') linSumId: string,
  ): Promise<LinearityInjectionRecordDTO[]> {
    return this.service.getInjectionsByLinSumId(linSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: LinearityInjectionRecordDTO,    
    description: 'Retrieves official Linearity Injection record by its Id',
  })
  async getInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
  ): Promise<LinearityInjectionRecordDTO> {
    return this.service.getInjectionById(id);
  }  
}
