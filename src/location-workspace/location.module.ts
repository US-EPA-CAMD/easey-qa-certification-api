import { Module } from '@nestjs/common';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    TestSummaryWorkspaceModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class LocationWorkspaceModule {}
