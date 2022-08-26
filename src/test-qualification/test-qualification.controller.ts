import { Controller } from '@nestjs/common';
import { TestQualificationService } from './test-qualification.service';

@Controller('test-qualification')
export class TestQualificationController {
  constructor(private readonly testQualificationService: TestQualificationService) {}
}
