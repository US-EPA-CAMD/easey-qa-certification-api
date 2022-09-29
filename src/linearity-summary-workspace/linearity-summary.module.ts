import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestSummaryWorkspaceModule } from './../test-summary-workspace/test-summary.module';
import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';
import { LinearitySummaryWorkspaceController } from './linearity-summary.controller';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { LinearitySummaryModule } from '../linearity-summary/linearity-summary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LinearitySummaryWorkspaceRepository,
      TestSummaryMasterDataRelationshipRepository,
    ]),
    forwardRef(() => LinearitySummaryModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => LinearityInjectionWorkspaceModule),
    HttpModule,
  ],
  controllers: [LinearitySummaryWorkspaceController],
  providers: [
    LinearitySummaryMap,
    LinearitySummaryWorkspaceService,
    LinearitySummaryChecksService,
  ],
  exports: [
    TypeOrmModule,
    LinearitySummaryMap,
    LinearitySummaryWorkspaceService,
    LinearitySummaryChecksService,
  ],
})
export class LinearitySummaryWorkspaceModule {}
