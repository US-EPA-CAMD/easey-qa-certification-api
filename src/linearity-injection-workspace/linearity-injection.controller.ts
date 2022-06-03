import {
  Get,
  Post,
  Body,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { LinearityInjectionBaseDTO, LinearityInjectionRecordDTO } from '../dto/linearity-injection.dto';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Injection')
export class LinearityInjectionWorkspaceController {
  
  constructor(
    private readonly service: LinearityInjectionWorkspaceService
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LinearityInjectionRecordDTO,
    description: 'Retrieves workspace Linearity Injection records',
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
    description: 'Retrieves workspace Linearity Injection record by its id',
  })
  async getLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
  ): Promise<LinearityInjectionRecordDTO> {
    return this.service.getLinearityInjection(id);
  }

  @Post()
  @ApiOkResponse({
    type: LinearityInjectionRecordDTO,
    description: 'Creates a Linearity Injection record in the workspace',
  })
  async createLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Body() _payload: LinearityInjectionBaseDTO,
  ): Promise<LinearityInjectionRecordDTO> {
    return;//this.service.createLinearityInjection(locationId, payload);
  }
}
