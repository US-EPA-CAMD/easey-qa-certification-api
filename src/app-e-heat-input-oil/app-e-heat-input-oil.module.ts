import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEHeatInputOilService } from './app-e-heat-input-oil.service';
import { AppEHeatInputOilController } from './app-e-heat-input-oil.controller';
import { AppEHeatInputOilRepository } from './app-e-heat-input-oil.repository';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { AppEHeatInputOilMap } from '../maps/app-e-heat-input-oil-map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEHeatInputOilRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [AppEHeatInputOilController],
  providers: [AppEHeatInputOilService, AppEHeatInputOilMap],
  exports: [TypeOrmModule, AppEHeatInputOilMap, AppEHeatInputOilService],
})
export class AppEHeatInputOilModule {}
