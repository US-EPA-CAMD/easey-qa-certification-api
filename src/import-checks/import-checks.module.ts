import { Module } from '@nestjs/common';

import { ImportChecksService } from './import-checks.service';
import { LocationWorkspaceModule } from '../location-workspace/location.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    LocationWorkspaceModule,
    TestSummaryWorkspaceModule
  ],
  providers: [ImportChecksService],
  exports: [ImportChecksService],
})
export class ImportChecksModule {}