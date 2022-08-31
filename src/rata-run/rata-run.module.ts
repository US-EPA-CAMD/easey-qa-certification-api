import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataRunRepository } from '../rata-run/rata-run.repository';
import { RataSummaryModule } from '../rata-summary/rata-summary.module';
import { RataRunController } from './rata-run.controller';
import { RataRunService } from './rata-run.service';
import { RataRunMap } from '../maps/rata-run.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataRunRepository]),
    forwardRef(() => RataSummaryModule),
  ],
  controllers: [RataRunController],
  providers: [RataRunService, RataRunMap],
  exports: [TypeOrmModule, RataRunMap, RataRunService],
})
export class RataRunModule {}
