import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';
import { TestQualificationWorkspaceController } from './test-qualification-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { TestQualificationChecksService } from './test-qualification-checks.service';
import { TestQualificationModule } from '../test-qualification/test-qualification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestQualificationWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => TestQualificationModule),
    HttpModule,
  ],
  controllers: [TestQualificationWorkspaceController],
  providers: [
    TestQualificationMap,
    TestQualificationWorkspaceService,
    TestQualificationChecksService,
  ],
  exports: [
    TypeOrmModule,
    TestQualificationMap,
    TestQualificationWorkspaceService,
    TestQualificationChecksService,
  ],
})
export class TestQualificationWorkspaceModule {}
