import { forwardRef, Module } from '@nestjs/common';
import { RataSummaryWorkspaceService } from './rata-summary-workspace.service';
import { RataSummaryWorkspaceController } from './rata-summary-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataWorkspaceModule } from '../rata-workspace/rata-workspace.module';
import { RataRunWorkspaceModule } from 'src/rata-run-workspace/rata-run.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataSummaryWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataWorkspaceModule),
    RataRunWorkspaceModule,
  ],
  controllers: [RataSummaryWorkspaceController],
  providers: [RataSummaryMap, RataSummaryWorkspaceService],
  exports: [TypeOrmModule, RataSummaryMap, RataSummaryWorkspaceService],
})
export class RataSummaryWorkspaceModule {}
