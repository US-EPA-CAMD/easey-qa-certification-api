import { Module } from '@nestjs/common';
import { TestQualificationService } from './test-qualification.service';
import { TestQualificationController } from './test-qualification.controller';

@Module({
  controllers: [TestQualificationController],
  providers: [TestQualificationService]
})
export class TestQualificationModule {}
