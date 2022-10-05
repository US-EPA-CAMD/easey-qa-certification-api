import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AppEHeatInputFromOilModule } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.module';
import { AppEHeatInputFromOilWorkspaceService } from './app-e-heat-input-from-oil.service';
import { AppEHeatInputFromOilWorkspaceController } from './app-e-heat-input-from-oil.controller';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEHeatInputFromOilWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AppEHeatInputFromOilModule),
    HttpModule,
  ],
  controllers: [AppEHeatInputFromOilWorkspaceController],
  providers: [AppEHeatInputFromOilWorkspaceService, AppEHeatInputFromOilMap],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromOilMap,
    AppEHeatInputFromOilWorkspaceService,
  ],
})
export class AppEHeatInputFromOilWorkspaceModule {}
