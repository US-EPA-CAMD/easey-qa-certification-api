import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HgInjectionModule } from '../hg-injection/hg-injection.module';
import { HgSummaryWorkspaceModule } from '../hg-summary-workspace/hg-summary-workspace.module';
import { HgInjectionMap } from '../maps/hg-injection.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HgInjectionWorkspaceController } from './hg-injection-workspace.controller';
import { HgInjectionWorkspaceRepository } from './hg-injection-workspace.repository';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HgInjectionWorkspaceRepository]),
    forwardRef(() => HgInjectionModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => HgSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [HgInjectionWorkspaceController],
  providers: [
    HgInjectionMap,
    HgInjectionWorkspaceRepository,
    HgInjectionWorkspaceService,
  ],
  exports: [TypeOrmModule, HgInjectionMap, HgInjectionWorkspaceService],
})
export class HgInjectionWorkspaceModule {}
