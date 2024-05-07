import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { AppEHeatInputFromGasController } from './app-e-heat-input-from-gas.controller';
import { AppEHeatInputFromGasRepository } from './app-e-heat-input-from-gas.repository';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppEHeatInputFromGasRepository])],
  controllers: [AppEHeatInputFromGasController],
  providers: [
    AppEHeatInputFromGasRepository,
    AppEHeatInputFromGasService,
    AppEHeatInputFromGasMap,
  ],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromGasMap,
    AppEHeatInputFromGasService,
  ],
})
export class AppEHeatInputFromGasModule {}
