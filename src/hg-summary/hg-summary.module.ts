import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HgSummaryService } from './hg-summary.service';
import { HgSummaryController } from './hg-summary.controller';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { HgSummaryRepository } from './hg-summary.repository';
import { HgInjectionModule } from '../hg-injection/hg-injection.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HgSummaryRepository]),
    forwardRef(() => HgInjectionModule),
  ],
  controllers: [HgSummaryController],
  providers: [HgSummaryMap, HgSummaryRepository, HgSummaryService],
  exports: [TypeOrmModule, HgSummaryMap, HgSummaryService],
})
export class HgSummaryModule {}
