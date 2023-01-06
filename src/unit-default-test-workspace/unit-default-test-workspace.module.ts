import { forwardRef, Module } from '@nestjs/common';
import { UnitDefaultTestWorkspaceService } from './unit-default-test-workspace.service';
import { UnitDefaultTestWorkspaceController } from './unit-default-test-workspace.controller';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { UnitDefaultTestWorkspaceRepository } from './unit-default-test-workspace.repository';
import { UnitDefaultTestModule } from '../unit-default-test/unit-default-test.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UnitDefaultTestRunWorkspaceModule } from '../unit-default-test-run-workspace/unit-default-test-run.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitDefaultTestWorkspaceRepository]),
    forwardRef(() => UnitDefaultTestModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => UnitDefaultTestRunWorkspaceModule),
    HttpModule,
  ],
  controllers: [UnitDefaultTestWorkspaceController],
  providers: [UnitDefaultTestMap, UnitDefaultTestWorkspaceService],
  exports: [TypeOrmModule, UnitDefaultTestMap, UnitDefaultTestWorkspaceService],
})
export class UnitDefaultTestWorkspaceModule {}
