import {
  Controller,
  Param,
  Post,
  Body,
  Get,
  Put,
  Delete,
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
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceDTO,
} from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Reference')
export class FlowToLoadReferenceWorkspaceController {
  constructor(private readonly service: FlowToLoadReferenceWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: FlowToLoadReferenceDTO,
    description:
      'Retrieves workspace Flow To Load Reference records by Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getFlowToLoadReferences(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<FlowToLoadReferenceDTO[]> {
    return this.service.getFlowToLoadReferences(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowToLoadReferenceDTO,
    description:
      'Retrieves a workspace Flow To Load Reference record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadReferenceDTO> {
    return this.service.getFlowToLoadReference(id);
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
    type: FlowToLoadReferenceDTO,
    description: 'Creates a workspace Flow To Load Reference record.',
  })
  async createFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FlowToLoadReferenceBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadReferenceDTO> {
    return this.service.createFlowToLoadReference(
      testSumId,
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
    type: FlowToLoadReferenceDTO,
    description: 'Updates a workspace Flow To Load Reference record',
  })
  editFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: FlowToLoadReferenceBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadReferenceDTO> {
    return this.service.editFlowToLoadReference(
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
    description: 'Deletes a Flow To Load Reference record from the workspace',
  })
  async deleteFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFlowToLoadReference(testSumId, id, user.userId);
  }
}
