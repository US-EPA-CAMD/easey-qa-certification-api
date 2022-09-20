import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post,
  Put, 
  Delete 
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import {
  TestQualificationBaseDTO,
  TestQualificationRecordDTO,
} from '../dto/test-qualification.dto';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

const userId = 'testUser';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Qualification')
export class TestQualificationWorkspaceController {
  constructor(private readonly service: TestQualificationWorkspaceService) {}

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
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    type: TestQualificationRecordDTO,
    description: 'Creates a workspace Test Qualification record.',
  })
  async createTestQualification(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: TestQualificationBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<TestQualificationRecordDTO> {
    return this.service.createTestQualification(testSumId, payload, userId);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Deletes a test qualification record from the workspace',
  })
  async deleteTestQualification(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('testQualificationId') testQualificationId: string,
  ): Promise<void> {
    return this.service.deleteTestQualification(testSumId, testQualificationId, userId);

  @Put(':id')
  //  @ApiBearerAuth('Token')
  //  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: TestQualificationRecordDTO,
    description: 'Updates a test qualification record in the workspace',
  })
  async testQualificationSummary(
    @Param('locId') locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: TestQualificationBaseDTO,
    //    @CurrentUser() userId: string,
  ): Promise<TestQualificationRecordDTO> {
    return this.service.updateTestQualification(testSumId, payload, userId);
  }
}
