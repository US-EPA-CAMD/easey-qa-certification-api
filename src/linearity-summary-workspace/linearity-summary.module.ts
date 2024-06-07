import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LinearityInjectionWorkspaceModule } from '../linearity-injection-workspace/linearity-injection.module';
import { LinearitySummaryModule } from '../linearity-summary/linearity-summary.module';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { TestSummaryMasterDataRelationshipModule } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.module';
import { TestSummaryWorkspaceModule } from './../test-summary-workspace/test-summary.module';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';
import { LinearitySummaryWorkspaceController } from './linearity-summary.controller';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinearitySummaryWorkspaceRepository]),
    forwardRef(() => LinearitySummaryModule),
    forwardRef(() => TestSummaryWorkspaceModule),
    forwardRef(() => LinearityInjectionWorkspaceModule),
    HttpModule,
    TestSummaryMasterDataRelationshipModule,
  ],
  controllers: [LinearitySummaryWorkspaceController],
  providers: [
    LinearitySummaryMap,
    LinearitySummaryWorkspaceRepository,
    LinearitySummaryWorkspaceService,
    LinearitySummaryChecksService,
  ],
  exports: [
    TypeOrmModule,
    LinearitySummaryWorkspaceRepository,
    LinearitySummaryMap,
    LinearitySummaryWorkspaceService,
    LinearitySummaryChecksService,
  ],
})
export class LinearitySummaryWorkspaceModule {}
