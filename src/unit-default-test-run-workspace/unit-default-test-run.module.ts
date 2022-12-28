import { forwardRef, Module } from '@nestjs/common';
import { UnitDefaultTestRunWorkspaceService } from './unit-default-test-run.service';
import { UnitDefaultTestRunWorkspaceController } from './unit-default-test-run.controller';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';
import { UnitDefaultTestModule } from '../unit-default-test/unit-default-test.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitDefaultTestRunWorkspaceRepository]),
    forwardRef(() => UnitDefaultTestModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [UnitDefaultTestRunWorkspaceController],
  providers: [UnitDefaultTestRunMap, UnitDefaultTestRunWorkspaceService],
  exports: [TypeOrmModule, UnitDefaultTestRunMap, UnitDefaultTestRunWorkspaceService],
})
export class UnitDefaultTestRunWorkspaceModule {}