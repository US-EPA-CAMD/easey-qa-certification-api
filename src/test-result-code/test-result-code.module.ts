import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestResultCodeRepository } from './test-result-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TestResultCodeRepository])],
  controllers: [],
  providers: [TestResultCodeRepository],
  exports: [TypeOrmModule, TestResultCodeRepository],
})
export class TestResultCodeModule {}
