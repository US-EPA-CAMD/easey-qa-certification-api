import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestQualificationMap } from '../maps/test-qualification.map';
import { MonitorSystemModule } from '../monitor-system/monitor-system.module';
import { TestQualificationModule } from '../test-qualification/test-qualification.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TestQualificationChecksService } from './test-qualification-checks.service';
import { TestQualificationWorkspaceController } from './test-qualification-workspace.controller';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestQualificationWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => TestQualificationModule),
    HttpModule,
    MonitorSystemModule,
  ],
  controllers: [TestQualificationWorkspaceController],
  providers: [
    TestQualificationMap,
    TestQualificationWorkspaceRepository,
    TestQualificationWorkspaceService,
    TestQualificationChecksService,
  ],
  exports: [
    TypeOrmModule,
    TestQualificationWorkspaceRepository,
    TestQualificationMap,
    TestQualificationWorkspaceService,
    TestQualificationChecksService,
  ],
})
export class TestQualificationWorkspaceModule {}
