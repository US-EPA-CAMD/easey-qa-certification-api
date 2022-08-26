import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataRunWorkspaceRepository } from './rata-run.repository';
import { RataSummaryWorkspaceModule } from '../rata-summary-workspace/rata-summary-workspace.module';
import { RataRunWorkspaceController } from './rata-run.controller';
import { RataRunWorkspaceService } from './rata-run.service';
import { RataRunMap } from '../maps/rata-run.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataRunWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => RataSummaryWorkspaceModule),
  ],
  controllers: [RataRunWorkspaceController],
  providers: [RataRunWorkspaceService, RataRunMap],
  exports: [TypeOrmModule, RataRunMap, RataRunWorkspaceService],
})
export class RataRunWorkspaceModule {}
