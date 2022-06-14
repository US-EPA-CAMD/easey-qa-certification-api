import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationWorkspaceService } from './location.service';
import { LocationWorkspaceRepository } from './location.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LocationWorkspaceRepository,
    ]),
    TestSummaryWorkspaceModule,
  ],
  controllers: [],
  providers: [LocationWorkspaceService],
  exports: [
    TypeOrmModule,
    LocationWorkspaceService
  ],
})
export class LocationWorkspaceModule {}
