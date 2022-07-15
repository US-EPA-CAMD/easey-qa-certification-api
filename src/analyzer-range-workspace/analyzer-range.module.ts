import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';
import { AnalyzerRangeService } from './analyzer-range.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyzerRangeWorkspaceRepository])],
  controllers: [],
  providers: [AnalyzerRangeService],
})
export class AnalyzerRangeModule {}
