import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';
import { AppEHeatInputFromGasController } from './app-e-heat-input-from-gas.controller';
import { AppEHeatInputFromGasRepository } from './app-e-heat-input-from-gas.repository';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppEHeatInputFromGasRepository]),
    HttpModule,
  ],
  controllers: [AppEHeatInputFromGasController],
  providers: [AppEHeatInputFromGasService, AppEHeatInputFromGasMap],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromGasMap,
    AppEHeatInputFromGasService,
  ],
})
export class AppEHeatInputFromGasModule {}
