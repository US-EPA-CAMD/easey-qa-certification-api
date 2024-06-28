import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentModule } from '../component-workspace/component.module';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { MonitorLocationModule } from '../monitor-location/monitor-location.module';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system-workspace.module';
import { ReportingPeriodModule } from '../reporting-period/reporting-period.module';
import { TestExtensionExemptionsChecksService } from './test-extension-exemptions-checks.service';
import { TestExtensionExemptionsWorkspaceController } from './test-extension-exemptions-workspace.controller';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';
import { TestExtensionExemptionsModule } from '../test-extension-exemptions/test-extension-exemptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestExtensionExemptionsWorkspaceRepository]),
    TestExtensionExemptionsModule,
    HttpModule,
    ComponentModule,
    MonitorSystemWorkspaceModule,
    ReportingPeriodModule,
    MonitorLocationModule,
  ],
  controllers: [TestExtensionExemptionsWorkspaceController],
  providers: [
    TestExtensionExemptionsChecksService,
    TestExtensionExemptionMap,
    TestExtensionExemptionsWorkspaceRepository,
    TestExtensionExemptionsWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    TestExtensionExemptionMap,
    TestExtensionExemptionsWorkspaceRepository,
    TestExtensionExemptionsWorkspaceService,
    TestExtensionExemptionsChecksService,
  ],
})
export class TestExtensionExemptionsWorkspaceModule {}
