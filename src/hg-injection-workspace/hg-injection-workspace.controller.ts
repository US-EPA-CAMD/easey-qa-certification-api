import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
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
  HgInjectionBaseDTO,
  HgInjectionRecordDTO,
} from '../dto/hg-injection.dto';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Injection')
export class HgInjectionWorkspaceController {
  constructor(private readonly service: HgInjectionWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: HgInjectionRecordDTO,
    description:
      'Retrieves workspace Hg Injection records by HG Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getHgInjections(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('hgTestSumId') hgTestSumId: string,
  ): Promise<HgInjectionRecordDTO[]> {
    return this.service.getHgInjectionsByHgTestSumId(hgTestSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    type: HgInjectionRecordDTO,
    description: 'Retrieves workspace Hg Injection record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('hgTestSumId') _hgTestSumId: string,
    @Param('id') id: string,
  ): Promise<HgInjectionRecordDTO> {
    return this.service.getHgInjection(id);
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
    type: HgInjectionRecordDTO,
    description: 'Creates a workspace Hg Injection record.',
  })
  async createHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('hgTestSumId') hgTestSumId: string,
    @Body() payload: HgInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgInjectionRecordDTO> {
    return this.service.createHgInjection(
      testSumId,
      hgTestSumId,
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
    type: HgInjectionRecordDTO,
    description: 'Updates a workspace Hg Injection record.',
  })
  updateHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('hgTestSumId') _hgTestSumId: string,
    @Param('id') id: string,
    @Body() payload: HgInjectionBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgInjectionRecordDTO> {
    return this.service.updateHgInjection(testSumId, id, payload, user.userId);
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
    description: 'Deletes a workspace HG Injection record',
  })
  async deleteHgInjection(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('hgTestSumId') _cycleTimeSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteHgInjection(testSumId, id, user.userId);
  }
}
