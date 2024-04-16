import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FuelFlowmeterAccuracyModule } from '../fuel-flowmeter-accuracy/fuel-flowmeter-accuracy.module';
import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FuelFlowmeterAccuracyWorkspaceController } from './fuel-flowmeter-accuracy-workspace.controller';
import { FuelFlowmeterAccuracyWorkspaceRepository } from './fuel-flowmeter-accuracy-workspace.repository';
import { FuelFlowmeterAccuracyWorkspaceService } from './fuel-flowmeter-accuracy-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowmeterAccuracyWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => FuelFlowmeterAccuracyModule),
    HttpModule,
  ],
  controllers: [FuelFlowmeterAccuracyWorkspaceController],
  providers: [
    FuelFlowmeterAccuracyMap,
    FuelFlowmeterAccuracyWorkspaceRepository,
    FuelFlowmeterAccuracyWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    FuelFlowmeterAccuracyMap,
    FuelFlowmeterAccuracyWorkspaceService,
  ],
})
export class FuelFlowmeterAccuracyWorkspaceModule {}
