import { forwardRef, Module } from '@nestjs/common';
import { TestQualificationService } from './test-qualification.service';
import { TestQualificationController } from './test-qualification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { TestQualificationRepository } from './test-qualification.repository';
import { TestQualificationMap } from '../maps/test-qualification.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestQualificationRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [TestQualificationController],
  providers: [TestQualificationMap, TestQualificationService],
  exports: [TypeOrmModule, TestQualificationMap, TestQualificationService],
})
export class TestQualificationModule {}
