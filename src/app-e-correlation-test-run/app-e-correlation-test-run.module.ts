import { Module } from '@nestjs/common';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';
import { AppECorrelationTestRunController } from './app-e-correlation-test-run.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { AppECorrelationTestRunRepository } from './app-e-correlation-test-run.repository';
import { AppEHeatInputFromGasModule } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.module';
import { AppEHeatInputFromOilModule } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppECorrelationTestRunRepository]),
    AppEHeatInputFromOilModule,
    AppEHeatInputFromGasModule,
  ],
  controllers: [AppECorrelationTestRunController],
  providers: [AppECorrelationTestRunMap, AppECorrelationTestRunService],
  exports: [
    TypeOrmModule,
    AppECorrelationTestRunMap,
    AppECorrelationTestRunService,
  ],
})
export class AppECorrelationTestRunModule {}
