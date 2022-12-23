import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { HttpModule } from '@nestjs/axios';
import { HgInjectionWorkspaceRepository } from './hg-injection-workspace.repository';
import { HgInjectionWorkspaceService } from './hg-injection-workspace.service';
import { HgInjectionWorkspaceController } from './hg-injection-workspace.controller';
import { HgInjectionMap } from 'src/maps/hg-injection.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([HgInjectionWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [HgInjectionWorkspaceController],
  providers: [HgInjectionMap, HgInjectionWorkspaceService],
  exports: [TypeOrmModule, HgInjectionMap, HgInjectionWorkspaceService],
})
export class HgInjectionWorkspaceModule {}
