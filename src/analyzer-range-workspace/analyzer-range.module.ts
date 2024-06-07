import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyzerRangeWorkspaceRepository } from './analyzer-range.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyzerRangeWorkspaceRepository])],
  controllers: [],
  providers: [AnalyzerRangeWorkspaceRepository],
  exports: [TypeOrmModule, AnalyzerRangeWorkspaceRepository],
})
export class AnalyzerRangeModule {}
