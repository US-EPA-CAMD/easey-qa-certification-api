import { forwardRef, Module } from '@nestjs/common';
import { AirEmissionTestWorkspaceService } from './air-emission-test-workspace.service';
import { AirEmissionTestWorkspaceController } from './air-emission-test-workspace.controller';
import { AirEmissionTestWorkspaceRepository } from './air-emission-test-workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AirEmissionTestMap } from '../maps/air-emission-test.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirEmissionTestWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [AirEmissionTestWorkspaceController],
  providers: [AirEmissionTestMap, AirEmissionTestWorkspaceService],
  exports: [TypeOrmModule, AirEmissionTestMap, AirEmissionTestWorkspaceService],
})
export class AirEmissionTestWorkspaceModule {}
