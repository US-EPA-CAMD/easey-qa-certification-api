import { Module } from '@nestjs/common';
import { RataSummaryService } from './rata-summary.service';
import { RataSummaryController } from './rata-summary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataSummaryRepository } from './rata-summary-workspace.repository';
import { RataSummaryMap } from '../maps/rata-summary.map';

@Module({
  imports: [TypeOrmModule.forFeature([RataSummaryRepository])],
  controllers: [RataSummaryController],
  providers: [RataSummaryMap, RataSummaryService],
  exports: [TypeOrmModule, RataSummaryMap, RataSummaryService],
})
export class RataSummaryModule {}
