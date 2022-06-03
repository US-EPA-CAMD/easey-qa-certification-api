import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearityInjectionWorkspaceController } from './linearity-injection.controller';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LinearityInjectionWorkspaceRepository,
    ])
  ],
  controllers: [
    LinearityInjectionWorkspaceController
  ],
  providers: [
    LinearityInjectionWorkspaceService,
    LinearityInjectionMap,
  ],
  exports: [
    TypeOrmModule,
    LinearityInjectionWorkspaceService,
    LinearityInjectionMap,
  ],
})
export class LinearityInjectionWorkspaceModule {}
