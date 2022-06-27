import { Module } from '@nestjs/common';

import { TestSummaryModule } from './../test-summary/test-summary.module';

@Module({
  imports: [TestSummaryModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class LocationModule {}
