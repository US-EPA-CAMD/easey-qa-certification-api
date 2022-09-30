import { Controller } from '@nestjs/common';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';

@Controller('app-e-correlation-test')
export class AppendixETestSummaryController {
  constructor(
    private readonly AppECorrelationTestSummaryWorkspaceService: AppECorrelationTestSummaryService,
  ) {}
}