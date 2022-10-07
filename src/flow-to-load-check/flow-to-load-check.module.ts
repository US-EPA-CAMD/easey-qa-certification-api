import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { FlowToLoadCheckService } from './flow-to-load-check.service';
import { FlowToLoadCheckRepository } from './flow-to-load-check.repository';
import { FlowToLoadCheckController } from './flow-to-load-check.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlowToLoadCheckRepository])],
  controllers: [FlowToLoadCheckController],
  providers: [FlowToLoadCheckMap, FlowToLoadCheckService],
  exports: [TypeOrmModule, FlowToLoadCheckMap, FlowToLoadCheckService],
})
export class FlowToLoadCheckModule {}
