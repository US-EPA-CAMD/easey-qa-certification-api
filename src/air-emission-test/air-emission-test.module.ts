import { forwardRef, Module } from '@nestjs/common';
import { AirEmissionTestService } from './air-emission-test.service';
import { AirEmissionTestController } from './air-emission-test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { AirEmissionTestRepository } from './air-emission-test.repository';
import { AirEmissionTestMap } from '../maps/air-emission-test.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirEmissionTestRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [AirEmissionTestController],
  providers: [AirEmissionTestMap, AirEmissionTestService],
  exports: [TypeOrmModule, AirEmissionTestMap, AirEmissionTestService],
})
export class AirEmissionTestModule {}
