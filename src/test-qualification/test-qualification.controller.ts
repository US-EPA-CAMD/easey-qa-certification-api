import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TestQualificationService } from './test-qualification.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Test Qualification')
export class TestQualificationController {
  constructor(private readonly service: TestQualificationService) {}
}
