import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { FlowToLoadReferenceController } from './flow-to-load-reference.controller';
import { FlowToLoadReferenceRepository } from './flow-to-load-reference.repository';
import { FlowToLoadReferenceService } from './flow-to-load-reference.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowToLoadReferenceRepository]),
    HttpModule,
  ],
  controllers: [FlowToLoadReferenceController],
  providers: [
    FlowToLoadReferenceMap,
    FlowToLoadReferenceRepository,
    FlowToLoadReferenceService,
  ],
  exports: [
    TypeOrmModule,
    FlowToLoadReferenceMap,
    FlowToLoadReferenceRepository,
    FlowToLoadReferenceService,
  ],
})
export class FlowToLoadReferenceModule {}
