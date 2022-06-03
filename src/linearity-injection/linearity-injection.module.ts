import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearityInjectionController } from './linearity-injection.controller';
import { LinearityInjectionRepository } from './linearity-injection.repository';
import { LinearityInjectionService } from './linearity-injection.service';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LinearityInjectionRepository,
    ])
  ],
  controllers: [
    LinearityInjectionController
  ],
  providers: [
    LinearityInjectionService,
    LinearityInjectionMap,
  ],
  exports: [
    TypeOrmModule,
    LinearityInjectionService,
    LinearityInjectionMap,
  ],
})
export class LinearityInjectionModule {}
