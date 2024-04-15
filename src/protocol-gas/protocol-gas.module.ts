import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtocolGasService } from './protocol-gas.service';
import { ProtocolGasController } from './protocol-gas.controller';
import { ProtocolGasRepository } from './protocol-gas.repository';
import { TestSummaryModule } from '../test-summary/test-summary.module';
import { ProtocolGasMap } from '../maps/protocol-gas.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProtocolGasRepository]),
    forwardRef(() => TestSummaryModule),
  ],
  controllers: [ProtocolGasController],
  providers: [ProtocolGasRepository, ProtocolGasService, ProtocolGasMap],
  exports: [TypeOrmModule, ProtocolGasMap, ProtocolGasService],
})
export class ProtocolGasModule {}
