import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { FlowToLoadCheckController } from './flow-to-load-check.controller';
import { FlowToLoadCheckRepository } from './flow-to-load-check.repository';
import { FlowToLoadCheckService } from './flow-to-load-check.service';

@Module({
  imports: [TypeOrmModule.forFeature([FlowToLoadCheckRepository])],
  controllers: [FlowToLoadCheckController],
  providers: [FlowToLoadCheckMap, FlowToLoadCheckService],
  exports: [
    TypeOrmModule,
    FlowToLoadCheckMap,
    FlowToLoadCheckRepository,
    FlowToLoadCheckService,
  ],
})
export class FlowToLoadCheckModule {}
