import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FuelFlowToLoadTestModule } from '../fuel-flow-to-load-test/fuel-flow-to-load-test.module';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FuelFlowToLoadTestWorkspaceController } from './fuel-flow-to-load-test-workspace.controller';
import { FuelFlowToLoadTestWorkspaceRepository } from './fuel-flow-to-load-test-workspace.repository';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowToLoadTestWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => FuelFlowToLoadTestModule),
    HttpModule,
  ],
  controllers: [FuelFlowToLoadTestWorkspaceController],
  providers: [
    FuelFlowToLoadTestMap,
    FuelFlowToLoadTestWorkspaceRepository,
    FuelFlowToLoadTestWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    FuelFlowToLoadTestMap,
    FuelFlowToLoadTestWorkspaceRepository,
    FuelFlowToLoadTestWorkspaceService,
  ],
})
export class FuelFlowToLoadTestWorkspaceModule {}
