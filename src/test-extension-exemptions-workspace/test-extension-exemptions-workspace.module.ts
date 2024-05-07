import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { TestExtensionExemptionsChecksService } from './test-extension-exemptions-checks.service';
import { TestExtensionExemptionsWorkspaceController } from './test-extension-exemptions-workspace.controller';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestExtensionExemptionsWorkspaceRepository,
      ComponentWorkspaceRepository,
      MonitorSystemWorkspaceRepository,
      ReportingPeriodRepository,
      MonitorLocationRepository,
    ]),
    HttpModule,
  ],
  controllers: [TestExtensionExemptionsWorkspaceController],
  providers: [
    ComponentWorkspaceRepository,
    MonitorLocationRepository,
    MonitorSystemWorkspaceRepository,
    ReportingPeriodRepository,
    TestExtensionExemptionsChecksService,
    TestExtensionExemptionMap,
    TestExtensionExemptionsWorkspaceRepository,
    TestExtensionExemptionsWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    TestExtensionExemptionMap,
    TestExtensionExemptionsWorkspaceService,
    TestExtensionExemptionsChecksService,
  ],
})
export class TestExtensionExemptionsWorkspaceModule {}
