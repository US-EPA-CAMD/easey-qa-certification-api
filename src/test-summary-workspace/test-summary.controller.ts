import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Delete,
  Controller,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';

import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  TestSummaryBaseDTO,
  TestSummaryRecordDTO,
} from '../dto/test-summary.dto';

import { TestSummaryParamsDTO } from '../dto/test-summary-params.dto';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Summary')
export class TestSummaryWorkspaceController {
  constructor(
    private readonly service: TestSummaryWorkspaceService,
    private readonly checksService: TestSummaryChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TestSummaryRecordDTO,
    description: 'Retrieves workspace Test Summary records per filter criteria',
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'testTypeCodes',
    required: false,
    explode: false,
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getTestSummaries(
    @Param('locId') locationId: string,
    @Query() params: TestSummaryParamsDTO,
  ): Promise<TestSummaryRecordDTO[]> {
    return this.service.getTestSummariesByLocationId(
      locationId,
      params.testTypeCodes,
      params.systemTypeCodes,
      params.beginDate,
      params.endDate,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    type: TestSummaryRecordDTO,
    description: 'Retrieves workspace Test Summary record by its id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getTestSummary(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
  ): Promise<TestSummaryRecordDTO> {
    return this.service.getTestSummaryById(id);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA', 'DPQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: TestSummaryRecordDTO,
    description: 'Creates a Test Summary record in the workspace',
  })
  async createTestSummary(
    @Param('locId') locationId: string,
    @Body() payload: TestSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestSummaryRecordDTO> {
    await this.checksService.runChecks(locationId, payload);
    return this.service.createTestSummary(locationId, payload, user.userId);
  }

  @Put(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA', 'DPQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: TestSummaryRecordDTO,
    description: 'Updates a Test Summary record in the workspace',
  })
  async updateTestSummary(
    @Param('locId') locationId: string,
    @Param('id') id: string,
    @Body() payload: TestSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestSummaryRecordDTO> {
    await this.checksService.runChecks(locationId, payload, false, true);
    return this.service.updateTestSummary(locationId, id, payload, user.userId);
  }

  @Delete(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor'],
      permissionsForFacility: ['DSQA', 'DPQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description: 'Deletes a Test Summary record from the workspace',
  })
  async deleteTestSummary(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteTestSummary(id);
  }
}
