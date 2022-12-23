import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HgInjectionMap } from 'src/maps/hg-injection.map';
import { HgInjectionController } from './hg-injection.controller';
import { HgInjectionRepository } from './hg-injection.repository';
import { HgInjectionService } from './hg-injection.service';

@Module({
  imports: [TypeOrmModule.forFeature([HgInjectionRepository])],
  controllers: [HgInjectionController],
  providers: [HgInjectionMap, HgInjectionService],
  exports: [TypeOrmModule, HgInjectionMap, HgInjectionService],
})
export class HgInjectionModule {}
