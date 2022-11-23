import { Module } from '@nestjs/common';
import { CalibrationInjectionService } from './calibration-injection.service';
import { CalibrationInjectionController } from './calibration-injection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalibrationInjectionRepository } from './calibration-injection.repository';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';

@Module({
  imports: [TypeOrmModule.forFeature([CalibrationInjectionRepository])],
  controllers: [CalibrationInjectionController],
  providers: [CalibrationInjectionMap, CalibrationInjectionService],
  exports: [
    TypeOrmModule,
    CalibrationInjectionMap,
    CalibrationInjectionService,
  ],
})
export class CalibrationInjectionModule {}
