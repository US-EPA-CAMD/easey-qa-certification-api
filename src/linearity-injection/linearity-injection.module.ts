import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { LinearityInjectionController } from './linearity-injection.controller';
import { LinearityInjectionRepository } from './linearity-injection.repository';
import { LinearityInjectionService } from './linearity-injection.service';

@Module({
  imports: [TypeOrmModule.forFeature([LinearityInjectionRepository])],
  controllers: [LinearityInjectionController],
  providers: [
    LinearityInjectionMap,
    LinearityInjectionRepository,
    LinearityInjectionService,
  ],
  exports: [
    TypeOrmModule,
    LinearityInjectionMap,
    LinearityInjectionRepository,
    LinearityInjectionService,
  ],
})
export class LinearityInjectionModule {}
