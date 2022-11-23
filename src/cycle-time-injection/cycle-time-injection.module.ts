import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CycleTimeInjectionService } from './cycle-time-injection.service';
import { CycleTimeInjectionController } from './cycle-time-injection.controller';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';

@Module({
  imports: [TypeOrmModule.forFeature([CycleTimeInjectionRepository])],
  controllers: [CycleTimeInjectionController],
  providers: [CycleTimeInjectionMap, CycleTimeInjectionService],
  exports: [TypeOrmModule, CycleTimeInjectionMap, CycleTimeInjectionService],
})
export class CycleTimeInjectionModule {}
