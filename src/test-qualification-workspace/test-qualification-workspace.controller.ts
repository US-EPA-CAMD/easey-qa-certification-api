import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
}
