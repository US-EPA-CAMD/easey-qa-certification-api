import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HttpModule } from '@nestjs/axios';

import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import { FuelFlowmeterAccuracyWorkspaceRepository } from './fuel-flowmeter-accuracy-workspace.repository';
import { FuelFlowmeterAccuracyWorkspaceService } from './fuel-flowmeter-accuracy-workspace.service';
import { FuelFlowmeterAccuracyWorkspaceController } from './fuel-flowmeter-accuracy-workspace.controller';
import { FuelFlowmeterAccuracyModule } from '../fuel-flowmeter-accuracy/fuel-flowmeter-accuracy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowmeterAccuracyWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => FuelFlowmeterAccuracyModule),
    HttpModule,
  ],
  controllers: [FuelFlowmeterAccuracyWorkspaceController],
  providers: [FuelFlowmeterAccuracyMap, FuelFlowmeterAccuracyWorkspaceService],
  exports: [
    TypeOrmModule,
    FuelFlowmeterAccuracyMap,
    FuelFlowmeterAccuracyWorkspaceService,
  ],
})
export class FuelFlowmeterAccuracyWorkspaceModule {}
