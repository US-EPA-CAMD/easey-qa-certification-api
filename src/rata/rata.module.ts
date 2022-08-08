import { forwardRef, Module } from '@nestjs/common';
import { RataService } from './rata.service';
import { RataController } from './rata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from 'src/test-summary/test-summary.module';
import { RataRepository } from './rata.repository';
import { RataMap } from 'src/maps/rata.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [RataController],
  providers: [RataMap, RataService],
  exports: [TypeOrmModule, RataMap, RataService],
})
export class RataModule {}
