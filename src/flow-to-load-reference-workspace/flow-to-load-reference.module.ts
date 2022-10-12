import { forwardRef, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

import { HttpModule } from '@nestjs/axios';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference.repository';
import { FlowToLoadReferenceWorkspaceController } from './flow-to-load-reference-workspace.controller';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowToLoadReferenceWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [FlowToLoadReferenceWorkspaceController],
  providers: [AeCorrelationSummaryMap, FlowToLoadReferenceWorkspaceService],
  exports: [
    TypeOrmModule,
    AeCorrelationSummaryMap,
    FlowToLoadReferenceWorkspaceService,
  ],
})
export class FlowToLoadReferenceWorkspaceModule {}
