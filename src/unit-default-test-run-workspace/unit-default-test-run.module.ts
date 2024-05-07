import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { UnitDefaultTestRunModule } from '../unit-default-test-run/unit-default-test-run.module';
import { UnitDefaultTestModule } from '../unit-default-test/unit-default-test.module';
import { UnitDefaultTestRunChecksService } from './unit-default-test-run-checks.service';
import { UnitDefaultTestRunWorkspaceController } from './unit-default-test-run.controller';
import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';
import { UnitDefaultTestRunWorkspaceService } from './unit-default-test-run.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitDefaultTestRunWorkspaceRepository]),
    forwardRef(() => UnitDefaultTestModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => UnitDefaultTestRunModule),
    HttpModule,
  ],
  controllers: [UnitDefaultTestRunWorkspaceController],
  providers: [
    UnitDefaultTestRunMap,
    UnitDefaultTestRunWorkspaceRepository,
    UnitDefaultTestRunWorkspaceService,
    UnitDefaultTestRunChecksService,
  ],
  exports: [
    TypeOrmModule,
    UnitDefaultTestRunMap,
    UnitDefaultTestRunWorkspaceService,
    UnitDefaultTestRunChecksService,
  ],
})
export class UnitDefaultTestRunWorkspaceModule {}
