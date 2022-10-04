import { Controller } from '@nestjs/common';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';

@Controller()
export class AppendixETestSummaryController {
  constructor(private readonly service: AppECorrelationTestSummaryService) {}
}
