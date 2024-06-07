import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HgInjectionMap } from '../maps/hg-injection.map';
import { HgInjectionController } from './hg-injection.controller';
import { HgInjectionRepository } from './hg-injection.repository';
import { HgInjectionService } from './hg-injection.service';

@Module({
  imports: [TypeOrmModule.forFeature([HgInjectionRepository])],
  controllers: [HgInjectionController],
  providers: [HgInjectionMap, HgInjectionRepository, HgInjectionService],
  exports: [
    TypeOrmModule,
    HgInjectionMap,
    HgInjectionRepository,
    HgInjectionService,
  ],
})
export class HgInjectionModule {}
