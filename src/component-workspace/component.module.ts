import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentWorkspaceRepository } from './component.repository';
import { ComponentService } from './component.service';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentWorkspaceRepository])],
  controllers: [],
  providers: [ComponentService],
  exports: [TypeOrmModule, ComponentService],
})
export class ComponentModule {}
