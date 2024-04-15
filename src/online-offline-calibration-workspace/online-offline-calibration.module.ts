import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineOfflineCalibrationWorkspaceRepository } from '../online-offline-calibration-workspace/online-offline-calibration.repository';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { OnlineOfflineCalibrationWorkspaceController } from './online-offline-calibration.controller';
import { OnlineOfflineCalibrationWorkspaceService } from './online-offline-calibration.service';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { OnlineOfflineCalibrationModule } from '../online-offline-calibration/online-offline-calibration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnlineOfflineCalibrationWorkspaceRepository]),
    HttpModule,
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => OnlineOfflineCalibrationModule),
  ],
  providers: [
    OnlineOfflineCalibrationWorkspaceRepository,
    OnlineOfflineCalibrationWorkspaceService,
    OnlineOfflineCalibrationMap,
  ],
  controllers: [OnlineOfflineCalibrationWorkspaceController],
  exports: [
    TypeOrmModule,
    OnlineOfflineCalibrationWorkspaceService,
    OnlineOfflineCalibrationMap,
  ],
})
export class OnlineOfflineCalibrationWorkspaceModule {}
