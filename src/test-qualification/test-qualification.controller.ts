import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TestQualificationService } from './test-qualification.service';
import { TestQualificationDTO, TestQualificationRecordDTO } from '../dto/test-qualification.dto';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Qualification')
export class TestQualificationController {
  constructor(private readonly service: TestQualificationService) {}

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
  ) : Promise<ArrayResponse<TestQualificationDTO>>  {
    const testQualificationDTOS = await this.service.getTestQualifications(testSumId);
    return  { items: testQualificationDTOS };
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
}
