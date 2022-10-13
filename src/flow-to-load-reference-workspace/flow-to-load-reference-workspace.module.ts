import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

import { HttpModule } from '@nestjs/axios';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference-workspace.repository';
import { FlowToLoadReferenceWorkspaceController } from './flow-to-load-reference-workspace.controller';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowToLoadReferenceWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [FlowToLoadReferenceWorkspaceController],
  providers: [FlowToLoadReferenceMap, FlowToLoadReferenceWorkspaceService],
  exports: [
    TypeOrmModule,
    FlowToLoadReferenceMap,
    FlowToLoadReferenceWorkspaceService,
  ],
})
export class FlowToLoadReferenceWorkspaceModule {}
