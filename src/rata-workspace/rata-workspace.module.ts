import { forwardRef, Module } from '@nestjs/common';
import { RataWorkspaceService } from './rata-workspace.service';
import { RataWorkspaceController } from './rata-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { RataMap } from '../maps/rata.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { RataChecksService } from './rata-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
  ],
  controllers: [RataWorkspaceController],
  providers: [RataMap, RataChecksService, RataWorkspaceService],
  exports: [TypeOrmModule, RataMap, RataChecksService, RataWorkspaceService],
})
export class RataWorkspaceModule {}
