import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';
import { LinearitySummaryWorkspaceController } from './linearity-summary.controller';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LinearitySummaryWorkspaceRepository,
    ]),
    LinearityInjectionWorkspaceModule,
  ],
  controllers: [
    LinearitySummaryWorkspaceController
  ],
  providers: [
    LinearitySummaryWorkspaceService,
    LinearitySummaryMap,
  ],
  exports: [
    TypeOrmModule,
    LinearitySummaryWorkspaceService,
    LinearitySummaryMap,
  ],
})
export class LinearitySummaryWorkspaceModule {}
