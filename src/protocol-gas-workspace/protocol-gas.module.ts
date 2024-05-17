import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentModule } from '../component-workspace/component.module';
import { GasComponentCodeModule } from '../gas-component-code/gas-component-code.module';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { MonitorSystemWorkspaceModule } from '../monitor-system-workspace/monitor-system-workspace.module';
import { ProtocolGasModule } from '../protocol-gas/protocol-gas.module';
import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { ProtocolGasWorkspaceController } from './protocol-gas.controller';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProtocolGasWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => ProtocolGasModule),
    HttpModule,
    GasComponentCodeModule,
    MonitorSystemWorkspaceModule,
    ComponentModule,
  ],
  controllers: [ProtocolGasWorkspaceController],
  providers: [
    ProtocolGasMap,
    ProtocolGasChecksService,
    ProtocolGasWorkspaceRepository,
    ProtocolGasWorkspaceService,
  ],
  exports: [
    TypeOrmModule,
    ProtocolGasMap,
    ProtocolGasWorkspaceRepository,
    ProtocolGasWorkspaceService,
    ProtocolGasChecksService,
  ],
})
export class ProtocolGasWorkspaceModule {}
