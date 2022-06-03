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
    description: 'Retrieves official Linearity Injection records',
  })
  async getLinearityInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('linSumId') _linSumId: string,
  ): Promise<LinearityInjectionRecordDTO[]> {
    return this.service.getLinearityInjections(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: LinearityInjectionRecordDTO,    
    description: 'Retrieves official Linearity Injection record by its id',
  })
  async getLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
  ): Promise<LinearityInjectionRecordDTO> {
    return this.service.getLinearityInjection(id);
  }  
}
