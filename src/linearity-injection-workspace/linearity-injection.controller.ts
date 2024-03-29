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

import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  LinearityInjectionBaseDTO,
  LinearityInjectionRecordDTO,
} from '../dto/linearity-injection.dto';
import { LinearityInjectionChecksService } from './linearity-injection-checks.service';

import { LinearityInjectionWorkspaceService } from './linearity-injection.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Linearity Injection')
export class LinearityInjectionWorkspaceController {
  constructor(
    private readonly service: LinearityInjectionWorkspaceService,
    private readonly checksService: LinearityInjectionChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: LinearityInjectionRecordDTO,
    description:
      'Retrieves workspace Linearity Injection records by Linearity Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
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
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
  ): Promise<LinearityInjectionRecordDTO> {
    return this.service.getInjectionById(id);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: LinearityInjectionRecordDTO,
    description: 'Creates a Linearity Injection record in the workspace',
  })
  async createLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('linSumId') linSumId: string,
    @Body() payload: LinearityInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LinearityInjectionRecordDTO> {
    await this.checksService.runChecks(payload, linSumId, testSumId);
    return this.service.createInjection(
      testSumId,
      linSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: LinearityInjectionRecordDTO,
    description: 'Updates a Linearity Injection record in the workspace',
  })
  async updateLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('linSumId') linSumId: string,
    @Param('id') id: string,
    @Body() payload: LinearityInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<LinearityInjectionRecordDTO> {
    await this.checksService.runChecks(
      payload,
      linSumId,
      testSumId,
      false,
      true,
    );
    return this.service.updateInjection(testSumId, id, payload, user.userId);
  }

  @Delete(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description: 'Deletes a Linearity Injection record from the workspace',
  })
  async deleteLinearityInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('linSumId') _linSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteInjection(testSumId, id, user.userId);
  }
}
