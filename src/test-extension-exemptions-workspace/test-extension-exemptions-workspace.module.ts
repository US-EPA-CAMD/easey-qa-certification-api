import { Module } from '@nestjs/common';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';
import { TestExtensionExemptionsWorkspaceController } from './test-extension-exemptions-workspace.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { UnitRepository } from '../unit/unit.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { TestExtensionExemptionsChecksService } from './test-extension-exemptions-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestExtensionExemptionsWorkspaceRepository,
      ComponentWorkspaceRepository,
      MonitorSystemRepository,
      ReportingPeriodRepository,
      MonitorLocationRepository,
      UnitRepository,
      StackPipeRepository,
    ]),
    HttpModule,
  ],
  controllers: [TestExtensionExemptionsWorkspaceController],
  providers: [
    TestExtensionExemptionMap,
    TestExtensionExemptionsWorkspaceService,
    TestExtensionExemptionsChecksService,
  ],
  exports: [
    TypeOrmModule,
    TestExtensionExemptionMap,
    TestExtensionExemptionsWorkspaceService,
    TestExtensionExemptionsChecksService,
  ],
})
export class TestExtensionExemptionsWorkspaceModule {}
