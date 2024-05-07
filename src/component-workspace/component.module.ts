import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ComponentWorkspaceRepository } from './component.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentWorkspaceRepository])],
  controllers: [],
  providers: [ComponentWorkspaceRepository],
  exports: [TypeOrmModule],
})
export class ComponentModule {}
