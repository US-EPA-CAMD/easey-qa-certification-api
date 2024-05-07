import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseController } from './rata-traverse.controller';
import { RataTraverseRepository } from './rata-traverse.repository';
import { RataTraverseService } from './rata-traverse.service';

@Module({
  imports: [TypeOrmModule.forFeature([RataTraverseRepository])],
  controllers: [RataTraverseController],
  providers: [RataTraverseRepository, RataTraverseService, RataTraverseMap],
  exports: [TypeOrmModule, RataTraverseMap, RataTraverseService],
})
export class RataTraverseModule {}
