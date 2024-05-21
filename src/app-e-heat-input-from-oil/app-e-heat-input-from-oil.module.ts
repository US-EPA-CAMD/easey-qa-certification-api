import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { AppEHeatInputFromOilController } from './app-e-heat-input-from-oil.controller';
import { AppEHeatInputFromOilRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilService } from './app-e-heat-input-from-oil.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppEHeatInputFromOilRepository])],
  controllers: [AppEHeatInputFromOilController],
  providers: [
    AppEHeatInputFromOilRepository,
    AppEHeatInputFromOilService,
    AppEHeatInputFromOilMap,
  ],
  exports: [
    TypeOrmModule,
    AppEHeatInputFromOilRepository,
    AppEHeatInputFromOilMap,
    AppEHeatInputFromOilService,
  ],
})
export class AppEHeatInputFromOilModule {}
