import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Appendix E Correlation Test Run')
export class AppECorrelationTestRunController {
  constructor(private readonly service: AppECorrelationTestRunService) {}
}
