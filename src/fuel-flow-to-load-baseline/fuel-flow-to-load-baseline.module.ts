import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';
import { FuelFlowToLoadBaselineController } from './fuel-flow-to-load-baseline.controller';
import { FuelFlowToLoadBaselineRepository } from './fuel-flow-to-load-baseline.repository';
import { FuelFlowToLoadBaselineService } from './fuel-flow-to-load-baseline.service';

@Module({
  imports: [TypeOrmModule.forFeature([FuelFlowToLoadBaselineRepository])],
  controllers: [FuelFlowToLoadBaselineController],
  providers: [
    FuelFlowToLoadBaselineMap,
    FuelFlowToLoadBaselineRepository,
    FuelFlowToLoadBaselineService,
  ],
  exports: [
    TypeOrmModule,
    FuelFlowToLoadBaselineMap,
    FuelFlowToLoadBaselineRepository,
    FuelFlowToLoadBaselineService,
  ],
})
export class FuelFlowToLoadBaselineModule {}
