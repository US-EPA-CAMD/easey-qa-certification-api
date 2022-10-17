import { forwardRef, Module } from '@nestjs/common';
import { CalibrationInjectionWorkspaceService } from './calibration-injection-workspace.service';
import { CalibrationInjectionWorkspaceController } from './calibration-injection-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from 'src/test-summary-workspace/test-summary.module';
import { CalibrationInjectionWorkspaceRepository } from './calibration-injection-workspace.repository';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalibrationInjectionWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [CalibrationInjectionWorkspaceController],
  providers: [CalibrationInjectionMap, CalibrationInjectionWorkspaceService],
  exports: [
    TypeOrmModule,
    CalibrationInjectionMap,
    CalibrationInjectionWorkspaceService,
  ],
})
export class CalibrationInjectionWorkspaceModule {}
