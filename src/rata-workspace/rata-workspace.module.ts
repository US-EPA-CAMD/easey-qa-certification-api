import { forwardRef, Module } from '@nestjs/common';
import { RataWorkspaceService } from './rata-workspace.service';
import { RataWorkspaceController } from './rata-workspace.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { RataMap } from '../maps/rata.map';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RataWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [RataWorkspaceController],
  providers: [RataMap, RataWorkspaceService],
  exports: [TypeOrmModule, RataMap, RataWorkspaceService],
})
export class RataWorkspaceModule {}
