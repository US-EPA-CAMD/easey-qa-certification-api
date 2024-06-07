import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { TestQualificationController } from './test-qualification.controller';
import { TestQualificationRepository } from './test-qualification.repository';
import { TestQualificationService } from './test-qualification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestQualificationRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [TestQualificationController],
  providers: [
    TestQualificationMap,
    TestQualificationRepository,
    TestQualificationService,
  ],
  exports: [
    TypeOrmModule,
    TestQualificationMap,
    TestQualificationRepository,
    TestQualificationService,
  ],
})
export class TestQualificationModule {}
