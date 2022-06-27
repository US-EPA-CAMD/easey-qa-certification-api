import {
  Get,
  Put,
  Post,
  Body,
  Delete,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiSecurity,
} from '@nestjs/swagger';

//import { AuthGuard } from '@us-epa-camd/easey-common/guards';
//import { CurrentUser } from '@us-epa-camd/easey-common/decorators';

import {
  LinearityInjectionBaseDTO,
  LinearityInjectionRecordDTO,
} from '../dto/linearity-injection.dto';

import { LinearityInjectionWorkspaceService } from './linearity-injection.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Injection')
export class LinearityInjectionWorkspaceController {
  constructor(private readonly service: LinearityInjectionWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LinearityInjectionRecordDTO,
    description:
      'Retrieves workspace Linearity Injection records by Linearity Summary Id',
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
    description: 'Retrieves workspace Linearity Injection record by its Id',
  })
  async getLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
  ): Promise<LinearityInjectionRecordDTO> {
    return this.service.getInjectionById(id);
  }

  @Post()
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: LinearityInjectionRecordDTO,
    description: 'Creates a Linearity Injection record in the workspace',
  })
  async createLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('linSumId') linSumId: string,
    @Body() payload: LinearityInjectionBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<LinearityInjectionRecordDTO> {
    const userId = 'testUser';
    return this.service.createInjection(testSumId, linSumId, payload, userId);
  }

  @Put(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: LinearityInjectionRecordDTO,
    description: 'Updates a Linearity Injection record in the workspace',
  })
  async updateLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
    @Body() payload: LinearityInjectionBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<LinearityInjectionRecordDTO> {
    const userId = 'testUser';
    return this.service.updateInjection(testSumId, id, payload, userId);
  }

  @Delete(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Deletes a Linearity Injection record from the workspace',
  })
  async deleteLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
    //    @CurrentUser() userId: string,
  ): Promise<void> {
    const userId = 'testUser';
    return this.service.deleteInjection(testSumId, id, userId);
  }
}
