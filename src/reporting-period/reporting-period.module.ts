import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportingPeriodRepository } from './reporting-period.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReportingPeriodRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ReportingPeriodModule {}
