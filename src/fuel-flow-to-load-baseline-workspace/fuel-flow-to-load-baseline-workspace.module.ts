import { forwardRef, Module } from '@nestjs/common';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';
import { FuelFlowToLoadBaselineWorkspaceController } from './fuel-flow-to-load-baseline-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelFlowToLoadBaselineWorkspaceRepository } from './fuel-flow-to-load-baseline-workspace.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HttpModule } from '@nestjs/axios';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowToLoadBaselineWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [FuelFlowToLoadBaselineWorkspaceController],
  providers: [
    FuelFlowToLoadBaselineMap,
    FuelFlowToLoadBaselineWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    FuelFlowToLoadBaselineMap,
    FuelFlowToLoadBaselineWorkspaceService,
  ],
})
export class FuelFlowToLoadBaselineWorkspaceModule {}
