import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComponentWorkspaceRepository } from './component.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ComponentWorkspaceRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ComponentModule {}
