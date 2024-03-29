import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { FlowToLoadCheckWorkspaceService } from './flow-to-load-check-workspace.service';
import { FlowToLoadCheckWorkspaceController } from './flow-to-load-check-workspace.controller';
import { FlowToLoadCheckWorkspaceRepository } from './flow-to-load-check-workspace.repository';
import { FlowToLoadCheckModule } from '../flow-to-load-check/flow-to-load-check.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowToLoadCheckWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => FlowToLoadCheckModule),
    HttpModule,
  ],
  controllers: [FlowToLoadCheckWorkspaceController],
  providers: [FlowToLoadCheckMap, FlowToLoadCheckWorkspaceService],
  exports: [TypeOrmModule, FlowToLoadCheckMap, FlowToLoadCheckWorkspaceService],
})
export class FlowToLoadCheckWorkspaceModule {}
