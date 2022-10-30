import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { FlowToLoadReferenceRepository } from './flow-to-load-reference.repository';
import { FlowToLoadReferenceService } from './flow-to-load-reference.service';
import { FlowToLoadReferenceController } from './flow-to-load-reference.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FlowToLoadReferenceRepository]),
    HttpModule,
  ],
  controllers: [FlowToLoadReferenceController],
  providers: [FlowToLoadReferenceMap, FlowToLoadReferenceService],
  exports: [TypeOrmModule, FlowToLoadReferenceMap, FlowToLoadReferenceService],
})
export class FlowToLoadReferenceModule {}
