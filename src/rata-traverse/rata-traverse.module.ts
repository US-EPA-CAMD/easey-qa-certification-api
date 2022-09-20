import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataTraverseService } from './rata-traverse.service';
import { RataTraverseController } from './rata-traverse.controller';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseRepository } from './rata-traverse.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RataTraverseRepository])],
  controllers: [RataTraverseController],
  providers: [RataTraverseService, RataTraverseMap],
  exports: [TypeOrmModule, RataTraverseService, RataTraverseMap],
})
export class RataTraverseModule {}
