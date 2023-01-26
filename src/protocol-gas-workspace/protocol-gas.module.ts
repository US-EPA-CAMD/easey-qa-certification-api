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

@Module({
  imports: [
    TypeOrmModule.forFeature([ProtocolGasWorkspaceRepository]),
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
