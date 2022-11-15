import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
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
  async getTestQualification(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ) {
    return this.service.getTestQualification(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: TestQualificationRecordDTO,
    description: 'Creates a workspace Test Qualification record.',
  })
  async createTestQualification(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: TestQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestQualificationRecordDTO> {
    await this.checksService.runChecks(payload, testSumId, null, false, false);
    return this.service.createTestQualification(
      testSumId,
      payload,
      user.userId,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: TestQualificationRecordDTO,
    description: 'Updates a test qualification record in the workspace',
  })
  async testQualificationSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: TestQualificationBaseDTO,
    @User() user: CurrentUser,
  ): Promise<TestQualificationRecordDTO> {
    await this.checksService.runChecks(payload, testSumId, null, false, true);
    return this.service.updateTestQualification(
      testSumId,
      id,
      payload,
      user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
