import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestSummaryWorkspaceModule } from '../test-summary-workspace/test-summary.module';
import { ProtocolGasWorkspaceService } from './protocol-gas.service';
import { ProtocolGasWorkspaceController } from './protocol-gas.controller';
import { ProtocolGasWorkspaceRepository } from './protocol-gas.repository';
import { ProtocolGasMap } from '../maps/protocol-gas.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProtocolGasWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [ProtocolGasWorkspaceController],
  providers: [ProtocolGasWorkspaceService, ProtocolGasMap],
  exports: [TypeOrmModule, ProtocolGasMap, ProtocolGasWorkspaceService],
})
export class ProtocolGasWorkspaceModule {}
