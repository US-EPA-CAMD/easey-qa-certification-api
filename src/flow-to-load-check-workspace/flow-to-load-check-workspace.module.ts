import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { FlowToLoadCheckWorkspaceService } from './flow-to-load-check-workspace.service';
import { FlowToLoadCheckWorkspaceController } from './flow-to-load-check-workspace.controller';
import { FlowToLoadCheckWorkspaceRepository } from './flow-to-load-check-workspace.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowToLoadCheckWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [FlowToLoadCheckWorkspaceController],
  providers: [FlowToLoadCheckMap, FlowToLoadCheckWorkspaceService],
  exports: [TypeOrmModule, FlowToLoadCheckMap, FlowToLoadCheckWorkspaceService],
})
export class FlowToLoadCheckWorkspaceModule {}
