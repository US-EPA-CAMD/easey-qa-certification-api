import { forwardRef, Module } from '@nestjs/common';
import { RataSummaryService } from './rata-summary.service';
import { RataSummaryController } from './rata-summary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataSummaryRepository } from './rata-summary.repository';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataRunModule } from '../rata-run/rata-run.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataSummaryRepository]),
    forwardRef(() => RataRunModule),
  ],
  controllers: [RataSummaryController],
  providers: [RataSummaryMap, RataSummaryRepository, RataSummaryService],
  exports: [
    TypeOrmModule,
    RataSummaryMap,
    RataSummaryRepository,
    RataSummaryService,
  ],
})
export class RataSummaryModule {}
