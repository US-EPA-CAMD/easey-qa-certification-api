import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference-workspace.repository';
import { FlowToLoadReferenceWorkspaceController } from './flow-to-load-reference-workspace.controller';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { FlowToLoadReferenceModule } from '../flow-to-load-reference/flow-to-load-reference.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowToLoadReferenceWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => FlowToLoadReferenceModule),
    HttpModule,
  ],
  controllers: [FlowToLoadReferenceWorkspaceController],
  providers: [
    FlowToLoadReferenceMap,
    FlowToLoadReferenceWorkspaceRepository,
    FlowToLoadReferenceWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    FlowToLoadReferenceMap,
    FlowToLoadReferenceWorkspaceService,
  ],
})
export class FlowToLoadReferenceWorkspaceModule {}
