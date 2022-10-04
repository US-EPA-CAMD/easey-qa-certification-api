import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppEHeatInputOilModule } from '../app-e-heat-input-oil/app-e-heat-input-oil.module';
import { AppEHeatInputOilWorkspaceService } from './app-e-heat-input-oil.service';
import { AppEHeatInputOilWorkspaceController } from './app-e-heat-input-oil.controller';
import { AppEHeatInputOilWorkspaceRepository } from './app-e-heat-input-oil.repository';
import { AppEHeatInputOilMap } from '../maps/app-e-heat-input-oil-map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEHeatInputOilWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AppEHeatInputOilModule),
    HttpModule,
  ],
  controllers: [AppEHeatInputOilWorkspaceController],
  providers: [AppEHeatInputOilWorkspaceService, AppEHeatInputOilMap],
  exports: [TypeOrmModule, AppEHeatInputOilMap, AppEHeatInputOilWorkspaceService],
})
export class AppEHeatInputOilWorkspaceModule {}
