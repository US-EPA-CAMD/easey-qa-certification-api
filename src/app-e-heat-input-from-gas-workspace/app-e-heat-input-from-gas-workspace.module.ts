import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';
import { AppEHeatInputFromGasWorkspaceController } from './app-e-heat-input-from-gas-workspace.controller';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas-workspace.repository';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppECorrelationTestSummaryWorkspaceModule } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEHeatInputFromGasWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AppECorrelationTestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [AppEHeatInputFromGasWorkspaceController],
  providers: [AppEHeatInputFromGasWorkspaceService, AppEHeatInputFromGasMap],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromGasMap,
    AppEHeatInputFromGasWorkspaceService,
  ],
})
export class AppEHeatInputFromGasWorkspaceModule {}
