import { forwardRef, Module } from '@nestjs/common';
import { RataService } from './rata.service';
import { RataController } from './rata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { RataRepository } from './rata.repository';
import { RataMap } from '../maps/rata.map';
import { RataSummaryModule } from '../rata-summary/rata-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataRepository]),
    forwardRef(() => TestSummaryModule),
    RataSummaryModule,
  ],
  controllers: [RataController],
  providers: [RataMap, RataService],
  exports: [TypeOrmModule, RataMap, RataService],
})
export class RataModule {}
