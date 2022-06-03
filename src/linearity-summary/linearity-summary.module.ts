import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearityInjectionModule } from '../linearity-injection/linearity-injection.module';
import { LinearitySummaryController } from './linearity-summary.controller';
import { LinearitySummaryRepository } from './linearity-summary.repository';
import { LinearitySummaryService } from './linearity-summary.service';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LinearitySummaryRepository,
    ]),
    LinearityInjectionModule,
  ],
  controllers: [
    LinearitySummaryController
  ],
  providers: [
    LinearitySummaryService,
    LinearitySummaryMap,
  ],
  exports: [
    TypeOrmModule,
    LinearitySummaryService,
    LinearitySummaryMap,
  ],
})
export class LinearitySummaryModule {}
