import { Module } from '@nestjs/common';
import { HgSummaryService } from './hg-summary.service';
import { HgSummaryController } from './hg-summary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { HgSummaryRepository } from './hg-summary.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HgSummaryRepository])],
  controllers: [HgSummaryController],
  providers: [HgSummaryMap, HgSummaryService],
  exports: [TypeOrmModule, HgSummaryMap, HgSummaryService],
})
export class HgSummaryModule {}
