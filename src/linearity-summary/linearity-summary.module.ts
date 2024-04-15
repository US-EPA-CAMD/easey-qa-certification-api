import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearityInjectionModule } from '../linearity-injection/linearity-injection.module';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryController } from './linearity-summary.controller';
import { LinearitySummaryRepository } from './linearity-summary.repository';
import { LinearitySummaryService } from './linearity-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinearitySummaryRepository]),
    LinearityInjectionModule,
  ],
  controllers: [LinearitySummaryController],
  providers: [
    LinearitySummaryMap,
    LinearitySummaryRepository,
    LinearitySummaryService,
  ],
  exports: [TypeOrmModule, LinearitySummaryMap, LinearitySummaryService],
})
export class LinearitySummaryModule {}
