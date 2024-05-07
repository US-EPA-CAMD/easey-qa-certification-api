import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { CycleTimeInjectionController } from './cycle-time-injection.controller';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';
import { CycleTimeInjectionService } from './cycle-time-injection.service';

@Module({
  imports: [TypeOrmModule.forFeature([CycleTimeInjectionRepository])],
  controllers: [CycleTimeInjectionController],
  providers: [
    CycleTimeInjectionMap,
    CycleTimeInjectionRepository,
    CycleTimeInjectionService,
  ],
  exports: [TypeOrmModule, CycleTimeInjectionMap, CycleTimeInjectionService],
})
export class CycleTimeInjectionModule {}
