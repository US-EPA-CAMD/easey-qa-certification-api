import { forwardRef, Module } from '@nestjs/common';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';
import { FuelFlowToLoadBaselineWorkspaceController } from './fuel-flow-to-load-baseline-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelFlowToLoadBaselineWorkspaceRepository } from './fuel-flow-to-load-baseline-workspace.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HttpModule } from '@nestjs/axios';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';
import { FuelFlowToLoadBaselineModule } from '../fuel-flow-to-load-baseline/fuel-flow-to-load-baseline.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowToLoadBaselineWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => FuelFlowToLoadBaselineModule),
    HttpModule,
  ],
  controllers: [FuelFlowToLoadBaselineWorkspaceController],
  providers: [
    FuelFlowToLoadBaselineMap,
    FuelFlowToLoadBaselineWorkspaceRepository,
    FuelFlowToLoadBaselineWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    FuelFlowToLoadBaselineMap,
    FuelFlowToLoadBaselineWorkspaceRepository,
    FuelFlowToLoadBaselineWorkspaceService,
  ],
})
export class FuelFlowToLoadBaselineWorkspaceModule {}
