import { forwardRef, Module } from '@nestjs/common';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';
import { FuelFlowToLoadTestWorkspaceController } from './fuel-flow-to-load-test-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelFlowToLoadTestWorkspaceRepository } from './fuel-flow-to-load-test-workspace.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestQualificationWorkspaceService } from '../test-qualification-workspace/test-qualification-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowToLoadTestWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [FuelFlowToLoadTestWorkspaceController],
  providers: [FuelFlowToLoadTestMap, FuelFlowToLoadTestWorkspaceService],
  exports: [
    TypeOrmModule,
    FuelFlowToLoadTestMap,
    FuelFlowToLoadTestWorkspaceService,
  ],
})
export class FuelFlowToLoadTestWorkspaceModule {}
