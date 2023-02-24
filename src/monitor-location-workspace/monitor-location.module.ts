import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationChecksService } from './monitor-location-checks.service';
import { LocationWorkspaceRepository } from './monitor-location.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationWorkspaceRepository]),
    TestSummaryWorkspaceModule,
  ],
  controllers: [],
  providers: [LocationChecksService],
  exports: [TypeOrmModule, LocationChecksService],
})
export class LocationWorkspaceModule {}
