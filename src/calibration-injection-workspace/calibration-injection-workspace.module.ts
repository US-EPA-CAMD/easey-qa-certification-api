import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { CalibrationInjectionModule } from '../calibration-injection/calibration-injection.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { CalibrationInjectionWorkspaceController } from './calibration-injection-workspace.controller';
import { CalibrationInjectionWorkspaceRepository } from './calibration-injection-workspace.repository';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalibrationInjectionWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    CalibrationInjectionModule,
    HttpModule,
  ],
  controllers: [CalibrationInjectionWorkspaceController],
  providers: [
    CalibrationInjectionMap,
    CalibrationInjectionWorkspaceRepository,
    CalibrationInjectionWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    CalibrationInjectionMap,
    CalibrationInjectionWorkspaceRepository,
    CalibrationInjectionWorkspaceService,
  ],
})
export class CalibrationInjectionWorkspaceModule {}
