import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearitySummaryModule } from '../linearity-summary/linearity-summary.module';
import { LinearityInjectionModule } from '../linearity-injection/linearity-injection.module';
import { ProtocolGasModule } from '../protocol-gas/protocol-gas.module';

import { TestSummaryController } from './test-summary.controller';
import { TestSummaryRepository } from './test-summary.repository';
import { TestSummaryService } from './test-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';
import { RataModule } from '../rata/rata.module';
import { TestQualificationModule } from '../test-qualification/test-qualification.module';
import { AirEmissionTestModule } from 'src/air-emission-test/air-emission-test.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestSummaryRepository]),
    LinearitySummaryModule,
    LinearityInjectionModule,
    ProtocolGasModule,
    RataModule,
    TestQualificationModule,
    AirEmissionTestModule,
  ],
  controllers: [TestSummaryController],
  providers: [TestSummaryMap, TestSummaryService],
  exports: [TypeOrmModule, TestSummaryMap, TestSummaryService],
})
export class TestSummaryModule {}
