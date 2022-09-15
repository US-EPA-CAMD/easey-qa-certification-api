import { forwardRef, Module } from '@nestjs/common';
import { AirEmissionTestingService } from './air-emission-testing.service';
import { AirEmissionTestingController } from './air-emission-testing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { AirEmissionTestingRepository } from './air-emission-testing.repository';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirEmissionTestingRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [AirEmissionTestingController],
  providers: [AirEmissionTestingMap, AirEmissionTestingService],
  exports: [TypeOrmModule, AirEmissionTestingMap, AirEmissionTestingService],
})
export class AirEmissionTestingModule {}
