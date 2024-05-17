import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FuelFlowmeterAccuracyController } from './fuel-flowmeter-accuracy.controller';
import { FuelFlowmeterAccuracyRepository } from './fuel-flowmeter-accuracy.repository';
import { FuelFlowmeterAccuracyService } from './fuel-flowmeter-accuracy.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowmeterAccuracyRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [FuelFlowmeterAccuracyController],
  providers: [
    FuelFlowmeterAccuracyMap,
    FuelFlowmeterAccuracyRepository,
    FuelFlowmeterAccuracyService,
  ],
  exports: [
    TypeOrmModule,
    FuelFlowmeterAccuracyMap,
    FuelFlowmeterAccuracyRepository,
    FuelFlowmeterAccuracyService,
  ],
})
export class FuelFlowmeterAccuracyModule {}
