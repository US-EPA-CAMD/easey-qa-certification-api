import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationChecksService } from './monitor-location-checks.service';
import { LocationWorkspaceRepository } from './monitor-location.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [],
  providers: [LocationWorkspaceRepository, LocationChecksService],
  exports: [TypeOrmModule, LocationWorkspaceRepository, LocationChecksService],
})
export class LocationWorkspaceModule {}
