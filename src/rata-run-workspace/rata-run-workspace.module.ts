import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { RataRunWorkspaceController } from './rata-run-workspace.controller';
import { RataRunWorkspaceService } from './rata-run-workspace.service';
import { RataRunMap } from '../maps/rata-run.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
<<<<<<< HEAD
import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run-workspace.module';
import { RataRunChecksService } from './rata-run-checks.service';
=======
<<<<<<< HEAD
import { RataRunChecksService } from './rata-run-checks.service';
import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run.module';
=======
import { FlowRataRunWorkspaceModule } from '../flow-rata-run-workspace/flow-rata-run-workspace.module';
>>>>>>> c75d52f (fix: changed rata-run-workspace file names)
>>>>>>> cd25b66 (fix: changed rata-run-workspace file names)

@Module({
  imports: [
    TypeOrmModule.forFeature([RataRunWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    FlowRataRunWorkspaceModule,
  ],
  controllers: [RataRunWorkspaceController],
  providers: [RataRunWorkspaceService, RataRunMap, RataRunChecksService],
  exports: [
    TypeOrmModule,
    RataRunMap,
    RataRunWorkspaceService,
    RataRunChecksService,
  ],
})
export class RataRunWorkspaceModule {}
