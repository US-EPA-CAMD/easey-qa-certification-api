import { forwardRef, Module } from '@nestjs/common';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';
import { AirEmissionTestingWorkspaceController } from './air-emission-testing-workspace.controller';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirEmissionTestingWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [AirEmissionTestingWorkspaceController],
  providers: [AirEmissionTestingMap, AirEmissionTestingWorkspaceService],
  exports: [
    TypeOrmModule,
    AirEmissionTestingMap,
    AirEmissionTestingWorkspaceService,
  ],
})
export class AirEmissionTestingWorkspaceModule {}
