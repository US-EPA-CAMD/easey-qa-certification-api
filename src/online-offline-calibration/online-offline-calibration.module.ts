import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineOfflineCalibrationRepository } from './online-offline-calibration.repository';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { OnlineOfflineCalibrationController } from './online-offline-calibration.controller';
import { OnlineOfflineCalibrationService } from './online-offline-calibration.service';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnlineOfflineCalibrationRepository]),
    HttpModule,
    forwardRef(() => TestSummaryModule),
  ],
  providers: [
    OnlineOfflineCalibrationRepository,
    OnlineOfflineCalibrationService,
    OnlineOfflineCalibrationMap,
  ],
  controllers: [OnlineOfflineCalibrationController],
  exports: [
    TypeOrmModule,
    OnlineOfflineCalibrationRepository,
    OnlineOfflineCalibrationService,
    OnlineOfflineCalibrationMap,
  ],
})
export class OnlineOfflineCalibrationModule {}
