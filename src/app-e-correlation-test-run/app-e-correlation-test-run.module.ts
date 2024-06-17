import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppEHeatInputFromGasModule } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.module';
import { AppEHeatInputFromOilModule } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.module';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { AppECorrelationTestRunController } from './app-e-correlation-test-run.controller';
import { AppECorrelationTestRunRepository } from './app-e-correlation-test-run.repository';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppECorrelationTestRunRepository]),
    AppEHeatInputFromOilModule,
    AppEHeatInputFromGasModule,
  ],
  controllers: [AppECorrelationTestRunController],
  providers: [
    AppECorrelationTestRunMap,
    AppECorrelationTestRunRepository,
    AppECorrelationTestRunService,
  ],
  exports: [
    TypeOrmModule,
    AppECorrelationTestRunRepository,
    AppECorrelationTestRunMap,
    AppECorrelationTestRunService,
  ],
})
export class AppECorrelationTestRunModule {}
