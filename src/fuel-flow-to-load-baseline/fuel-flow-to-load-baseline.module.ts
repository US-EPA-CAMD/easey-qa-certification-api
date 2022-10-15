import { forwardRef, Module } from '@nestjs/common';
import { FuelFlowToLoadBaselineService } from './fuel-flow-to-load-baseline.service';
import { FuelFlowToLoadBaselineController } from './fuel-flow-to-load-baseline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { FuelFlowToLoadBaselineRepository } from './fuel-flow-to-load-baseline.repository';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowToLoadBaselineRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [FuelFlowToLoadBaselineController],
  providers: [FuelFlowToLoadBaselineMap, FuelFlowToLoadBaselineService],
  exports: [
    TypeOrmModule,
    FuelFlowToLoadBaselineMap,
    FuelFlowToLoadBaselineService,
  ],
})
export class FuelFlowToLoadBaselineModule {}
