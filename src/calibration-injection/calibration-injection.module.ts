import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { CalibrationInjectionController } from './calibration-injection.controller';
import { CalibrationInjectionRepository } from './calibration-injection.repository';
import { CalibrationInjectionService } from './calibration-injection.service';

@Module({
  imports: [TypeOrmModule.forFeature([CalibrationInjectionRepository])],
  controllers: [CalibrationInjectionController],
  providers: [CalibrationInjectionMap, CalibrationInjectionService],
  exports: [
    TypeOrmModule,
    CalibrationInjectionMap,
    CalibrationInjectionRepository,
    CalibrationInjectionService,
  ],
})
export class CalibrationInjectionModule {}
