import { forwardRef, Module } from '@nestjs/common';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';
import { HgSummaryWorkspaceController } from './hg-summary-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HttpModule } from '@nestjs/axios';
import { HgSummaryMap } from '../maps/hg-summary.map';
import { HgSummaryWorkspaceRepository } from './hg-summary-workspace.repository';
import { HgSummaryModule } from '../hg-summary/hg-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HgSummaryWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => HgSummaryModule),
    HttpModule,
  ],
  controllers: [HgSummaryWorkspaceController],
  providers: [HgSummaryMap, HgSummaryWorkspaceService],
  exports: [TypeOrmModule, HgSummaryMap, HgSummaryWorkspaceService],
})
export class HgSummaryWorkspaceModule {}
