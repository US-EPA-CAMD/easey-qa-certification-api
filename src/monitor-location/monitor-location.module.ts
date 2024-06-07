import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { MonitorLocationRepository } from './monitor-location.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitorLocationRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [],
  providers: [MonitorLocationRepository],
  exports: [TypeOrmModule, MonitorLocationRepository],
})
export class MonitorLocationModule {}
