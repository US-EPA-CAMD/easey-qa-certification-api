import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';
import { TestQualificationWorkspaceController } from './test-qualification-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestQualificationWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [TestQualificationWorkspaceController],
  providers: [TestQualificationMap, TestQualificationWorkspaceService],
  exports: [
    TypeOrmModule,
    TestQualificationMap,
    TestQualificationWorkspaceService,
  ],
})
export class TestQualificationWorkspaceModule {}
