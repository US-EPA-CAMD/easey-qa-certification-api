import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestSummaryWorkspaceModule } from './../test-summary-workspace/test-summary.module';
import { LinearityInjectionWorkspaceController } from './linearity-injection.controller';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { LinearityInjectionChecksService } from './linearity-injection-checks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinearityInjectionWorkspaceRepository]),
    forwardRef(() => TestSummaryWorkspaceModule),
  ],
  controllers: [LinearityInjectionWorkspaceController],
  providers: [
    LinearityInjectionMap,
    LinearityInjectionWorkspaceService,
    LinearityInjectionChecksService,
  ],
  exports: [
    TypeOrmModule,
    LinearityInjectionMap,
    LinearityInjectionWorkspaceService,
    LinearityInjectionChecksService,
  ],
})
export class LinearityInjectionWorkspaceModule {}
