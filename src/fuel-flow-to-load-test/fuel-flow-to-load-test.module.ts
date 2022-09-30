import { forwardRef, Module } from '@nestjs/common';
import { FuelFlowToLoadTestService } from './fuel-flow-to-load-test.service';
import { FuelFlowToLoadTestController } from './fuel-flow-to-load-test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelFlowToLoadTestRepository } from './fuel-flow-to-load-test.repository';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([FuelFlowToLoadTestRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [FuelFlowToLoadTestController],
  providers: [FuelFlowToLoadTestMap, FuelFlowToLoadTestService],
  exports: [TypeOrmModule, FuelFlowToLoadTestMap, FuelFlowToLoadTestService],
})
export class FuelFlowToLoadTestModule {}
