import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';
import { AirEmissionTestingWorkspaceController } from './air-emission-testing-workspace.controller';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { AirEmissionTestingChecksService } from './air-emission-testing-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirEmissionTestingWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    HttpModule,
  ],
  controllers: [AirEmissionTestingWorkspaceController],
  providers: [
    AirEmissionTestingMap,
    AirEmissionTestingWorkspaceService,
    AirEmissionTestingChecksService,
  ],
  exports: [
    TypeOrmModule,
    AirEmissionTestingMap,
    AirEmissionTestingWorkspaceService,
    AirEmissionTestingChecksService,
  ],
})
export class AirEmissionTestingWorkspaceModule {}
