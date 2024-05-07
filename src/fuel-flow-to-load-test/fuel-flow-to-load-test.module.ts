import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { FuelFlowToLoadTestController } from './fuel-flow-to-load-test.controller';
import { FuelFlowToLoadTestRepository } from './fuel-flow-to-load-test.repository';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowToLoadTestRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [FuelFlowToLoadTestController],
  providers: [
    FuelFlowToLoadTestMap,
    FuelFlowToLoadTestRepository,
    FuelFlowToLoadTestService,
  ],
  exports: [TypeOrmModule, FuelFlowToLoadTestMap, FuelFlowToLoadTestService],
})
export class FuelFlowToLoadTestModule {}
