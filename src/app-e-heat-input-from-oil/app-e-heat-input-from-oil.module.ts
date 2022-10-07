import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEHeatInputFromOilService } from './app-e-heat-input-from-oil.service';
import { AppEHeatInputFromOilController } from './app-e-heat-input-from-oil.controller';
import { AppEHeatInputFromOilRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';

@Module({
  imports: [TypeOrmModule.forFeature([AppEHeatInputFromOilRepository])],
  controllers: [AppEHeatInputFromOilController],
  providers: [AppEHeatInputFromOilService, AppEHeatInputFromOilMap],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromOilMap,
    AppEHeatInputFromOilService,
  ],
})
export class AppEHeatInputFromOilModule {}
