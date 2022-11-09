import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HttpModule } from '@nestjs/axios';
import { FuelFlowmeterAccuracyRepository } from './fuel-flowmeter-accuracy.repository';
import { FuelFlowmeterAccuracyService } from './fuel-flowmeter-accuracy.service';
import { FuelFlowmeterAccuracyController } from './fuel-flowmeter-accuracy.controller';
import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowmeterAccuracyRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [FuelFlowmeterAccuracyController],
  providers: [FuelFlowmeterAccuracyMap, FuelFlowmeterAccuracyService],
  exports: [
    TypeOrmModule,
    FuelFlowmeterAccuracyMap,
    FuelFlowmeterAccuracyService,
  ],
})
export class FlowToLoadReferenceModule {}
