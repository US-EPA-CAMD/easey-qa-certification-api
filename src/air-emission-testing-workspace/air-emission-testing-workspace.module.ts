import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { AirEmissionTestingWorkspaceService } from './air-emission-testing-workspace.service';
import { AirEmissionTestingWorkspaceController } from './air-emission-testing-workspace.controller';
import { AirEmissionTestingWorkspaceRepository } from './air-emission-testing-workspace.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { AirEmissionTestingMap } from '../maps/air-emission-testing.map';
import { AirEmissionTestingChecksService } from './air-emission-testing-checks.service';
import { AirEmissionTestingModule } from '../air-emission-testing/air-emission-testing.module';
import { AirEmissionTestingRepository } from '../air-emission-testing/air-emission-testing.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AirEmissionTestingWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => AirEmissionTestingModule),
    HttpModule,
  ],
  controllers: [AirEmissionTestingWorkspaceController],
  providers: [
    AirEmissionTestingMap,
    AirEmissionTestingWorkspaceRepository,
    AirEmissionTestingWorkspaceService,
    AirEmissionTestingChecksService,
    AirEmissionTestingRepository,
  ],
  exports: [
    TypeOrmModule,
    AirEmissionTestingMap,
    AirEmissionTestingWorkspaceService,
    AirEmissionTestingChecksService,
  ],
})
export class AirEmissionTestingWorkspaceModule {}
