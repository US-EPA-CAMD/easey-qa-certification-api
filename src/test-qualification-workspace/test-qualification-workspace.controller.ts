import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  TestQualificationBaseDTO,
  TestQualificationRecordDTO,
} from '../dto/test-qualification.dto';
import { TestQualificationChecksService } from './test-qualification-checks.service';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Qualification')
export class TestQualificationWorkspaceController {
  constructor(
    private readonly service: TestQualificationWorkspaceService,
    private readonly checksService: TestQualificationChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: TestQualificationRecordDTO,
    description:
      'Retrieves official Test Qualification records by Test Summary Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getTestQualifications(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ) {
    return this.service.getTestQualifications(testSumId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: TestQualificationRecordDTO,
    description: 'Retrieves official Test Qualification record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  async getTestQualification(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getTestQualification(id);
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
    type: TestQualificationRecordDTO,
    description: 'Creates a workspace Test Qualification record.',
  })
  async createTestQualification(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: TestQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestQualificationRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      null,
      testSumId,
      null,
      null,
      false,
      false,
    );
    return this.service.createTestQualification(
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
    type: TestQualificationRecordDTO,
    description: 'Updates a test qualification record in the workspace',
  })
  async testQualificationSummary(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: TestQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestQualificationRecordDTO> {
    await this.checksService.runChecks(
      locationId,
      payload,
      null,
      testSumId,
      null,
      null,
      false,
      true,
    );
    return this.service.updateTestQualification(
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
    description: 'Deletes a test qualification record from the workspace',
  })
  async deleteTestQualification(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') testQualificationId: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteTestQualification(
      testSumId,
      testQualificationId,
      user.userId,
    );
  }
}
