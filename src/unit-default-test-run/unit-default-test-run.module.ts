import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { UnitDefaultTestRunController } from './unit-default-test-run.controller';
import { UnitDefaultTestRunRepository } from './unit-default-test-run.repository';
import { UnitDefaultTestRunService } from './unit-default-test-run.service';

@Module({
  imports: [TypeOrmModule.forFeature([UnitDefaultTestRunRepository])],
  controllers: [UnitDefaultTestRunController],
  providers: [
    UnitDefaultTestRunMap,
    UnitDefaultTestRunRepository,
    UnitDefaultTestRunService,
  ],
  exports: [
    TypeOrmModule,
    UnitDefaultTestRunMap,
    UnitDefaultTestRunRepository,
    UnitDefaultTestRunService,
  ],
})
export class UnitDefaultTestRunModule {}
