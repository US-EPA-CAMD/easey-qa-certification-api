import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { UnitDefaultTestRunWorkspaceModule } from '../unit-default-test-run-workspace/unit-default-test-run.module';
import { UnitDefaultTestModule } from '../unit-default-test/unit-default-test.module';
import { UnitDefaultTestWorkspaceController } from './unit-default-test-workspace.controller';
import { UnitDefaultTestWorkspaceRepository } from './unit-default-test-workspace.repository';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitDefaultTestWorkspaceRepository]),
    forwardRef(() => UnitDefaultTestModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => UnitDefaultTestRunWorkspaceModule),
    HttpModule,
  ],
  controllers: [UnitDefaultTestWorkspaceController],
  providers: [
    UnitDefaultTestMap,
    UnitDefaultTestWorkspaceRepository,
    UnitDefaultTestWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    UnitDefaultTestMap,
    UnitDefaultTestWorkspaceRepository,
    UnitDefaultTestWorkspaceService,
  ],
})
export class UnitDefaultTestWorkspaceModule {}
