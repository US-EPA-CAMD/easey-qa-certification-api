import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
=======
<<<<<<< HEAD:src/flow-rata-run-workspace/flow-rata-run.module.ts
import { FlowRataRunWorkspaceRepository } from './flow-rata-run.repository';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run-workspace.module';
import { FlowRataRunWorkspaceController } from './flow-rata-run.controller';
import { FlowRataRunWorkspaceService } from './flow-rata-run.service';
=======
>>>>>>> cd25b66 (fix: changed rata-run-workspace file names)
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { RataRunWorkspaceModule } from '../rata-run-workspace/rata-run-workspace.module';
import { FlowRataRunWorkspaceController } from './flow-rata-run-workspace.controller';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';
<<<<<<< HEAD
=======
>>>>>>> c75d52f (fix: changed rata-run-workspace file names):src/flow-rata-run-workspace/flow-rata-run-workspace.module.ts
>>>>>>> cd25b66 (fix: changed rata-run-workspace file names)
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { RataTraverseWorkspaceModule } from '../rata-traverse-workspace/rata-traverse-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowRataRunWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataRunWorkspaceModule),
<<<<<<< HEAD
<<<<<<< HEAD
    forwardRef(() => TestSummaryWorkspaceModule),
=======
>>>>>>> cd25b66 (fix: changed rata-run-workspace file names)
=======
=======
    RataTraverseWorkspaceModule,
>>>>>>> bbdbaaf (add POST RATA Traverse endpoint)
>>>>>>> af6037d (add POST RATA Traverse endpoint)
  ],
  controllers: [FlowRataRunWorkspaceController],
  providers: [FlowRataRunWorkspaceService, FlowRataRunMap],
  exports: [TypeOrmModule, FlowRataRunMap, FlowRataRunWorkspaceService],
})
export class FlowRataRunWorkspaceModule {}
