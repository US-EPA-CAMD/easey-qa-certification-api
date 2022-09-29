import { Module } from '@nestjs/common';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';
import { AppECorrelationTestRunController } from './app-e-correlation-test-run.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { AppECorrelationTestRunRepository } from './app-e-correlation-test-run.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AppECorrelationTestRunRepository])],
  controllers: [AppECorrelationTestRunController],
  providers: [AppECorrelationTestRunMap, AppECorrelationTestRunService],
  exports: [
    TypeOrmModule,
    AppECorrelationTestRunMap,
    AppECorrelationTestRunService,
  ],
})
export class AppECorrelationTestRunModule {}
