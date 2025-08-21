import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { QASuppAttributeRepository } from './qa-supp-attribute.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([QASuppAttributeRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [],
  providers: [QASuppAttributeRepository],
  exports: [TypeOrmModule, QASuppAttributeRepository],
})
export class QASuppAttributeModule {}