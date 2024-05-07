import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { GasComponentCodeRepository } from '../gas-component-code/gas-component-code.repository';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { ProtocolGasModule } from '../protocol-gas/protocol-gas.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { ProtocolGasWorkspaceController } from './protocol-gas.controller';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProtocolGasWorkspaceRepository,
      GasComponentCodeRepository,
      MonitorSystemWorkspaceRepository,
      ComponentWorkspaceRepository,
    ]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => ProtocolGasModule),
    HttpModule,
  ],
  controllers: [ProtocolGasWorkspaceController],
  providers: [
    ComponentWorkspaceRepository,
    GasComponentCodeRepository,
    MonitorSystemWorkspaceRepository,
    ProtocolGasMap,
    ProtocolGasChecksService,
    ProtocolGasWorkspaceRepository,
    ProtocolGasWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    ProtocolGasMap,
    ProtocolGasWorkspaceService,
    ProtocolGasChecksService,
  ],
})
export class ProtocolGasWorkspaceModule {}
