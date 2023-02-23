import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { ProtocolGasModule } from '../protocol-gas/protocol-gas.module';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';
import { ProtocolGasWorkspaceController } from './protocol-gas.controller';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';
import { ProtocolGasMap } from '../maps/protocol-gas.map';
import { ProtocolGasChecksService } from './protocol-gas-checks.service';
import { GasComponentCodeRepository } from '../gas-component-code/gas-component-code.repository';
import { GasTypeCodeRepository } from '../gas-type-code/gas-type-code.repository';
import { CrossCheckCatalogValueRepository } from '../cross-check-catalog-value/cross-check-catalog-value.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProtocolGasWorkspaceRepository,
      GasComponentCodeRepository,
      MonitorSystemWorkspaceRepository,
      ComponentWorkspaceRepository,
      GasTypeCodeRepository,
      CrossCheckCatalogValueRepository,
    ]),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => ProtocolGasModule),
    HttpModule,
  ],
  controllers: [ProtocolGasWorkspaceController],
  providers: [
    ProtocolGasWorkspaceService,
    ProtocolGasMap,
    ProtocolGasChecksService,
  ],
  exports: [
    TypeOrmModule,
    ProtocolGasMap,
    ProtocolGasWorkspaceService,
    ProtocolGasChecksService,
  ],
})
export class ProtocolGasWorkspaceModule {}
