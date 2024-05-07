import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { AirEmissionTestingController } from './air-emission-testing.controller';
import { AirEmissionTestingRepository } from './air-emission-testing.repository';
import { AirEmissionTestingService } from './air-emission-testing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirEmissionTestingRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [AirEmissionTestingController],
  providers: [
    AirEmissionTestingMap,
    AirEmissionTestingRepository,
    AirEmissionTestingService,
  ],
  exports: [TypeOrmModule, AirEmissionTestingMap, AirEmissionTestingService],
})
export class AirEmissionTestingModule {}
