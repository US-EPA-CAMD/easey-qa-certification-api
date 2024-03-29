import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionRecordDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionChecksService } from './cycle-time-injection-workspace-checks.service';
import { CycleTimeInjectionWorkspaceService } from './cycle-time-injection-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Cycle Time Injection')
export class CycleTimeInjectionWorkspaceController {
  constructor(
    private readonly service: CycleTimeInjectionWorkspaceService,
    private readonly checksService: CycleTimeInjectionChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: CycleTimeInjectionRecordDTO,
    description:
      'Retreives workspace Cycle Time Injection records by Cycle Time Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
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
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getCycleTimeInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('cycleTimeSumId') _cycleTimeSumId: string,
    @Param('id') id: string,
  ): Promise<CycleTimeInjectionRecordDTO> {
    return this.service.getCycleTimeInjection(id);
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
    type: CycleTimeInjectionRecordDTO,
    description: 'Creates a Cycle Time Injection record in the workspace',
  })
  async createCycleTimeInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('cycleTimeSumId') cycleTimeSumId: string,
    @Body() payload: CycleTimeInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CycleTimeInjectionRecordDTO> {
    await this.checksService.runChecks(
      payload,
      null,
      cycleTimeSumId,
      testSumId,
      false,
    );
    return this.service.createCycleTimeInjection(
      testSumId,
      cycleTimeSumId,
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
    type: CycleTimeInjectionRecordDTO,
    description: ' Updates a Cycle Time Injection record in the workspace',
  })
  async updateCycleTimeInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('cycleTimeSumId') _cycleTimeSumId: string,
    @Param('id') id: string,
    @Body() payload: CycleTimeInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<CycleTimeInjectionRecordDTO> {
    await this.checksService.runChecks(
      payload,
      id,
      _cycleTimeSumId,
      testSumId,
      false,
    );
    return this.service.updateCycleTimeInjection(
      testSumId,
      id,
      payload,
      user.userId,
    );
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
    description: 'Deletes a workspace Cycle Time Injection record',
  })
  async deleteCycleTimeInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('cycleTimeSumId') _cycleTimeSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteCycleTimeInjection(testSumId, id, user.userId);
  }
}
