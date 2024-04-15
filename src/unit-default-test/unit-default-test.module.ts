import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { UnitDefaultTestRunModule } from '../unit-default-test-run/unit-default-test-run.module';
import { UnitDefaultTestController } from './unit-default-test.controller';
import { UnitDefaultTestRepository } from './unit-default-test.repository';
import { UnitDefaultTestService } from './unit-default-test.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitDefaultTestRepository]),
    forwardRef(() => UnitDefaultTestRunModule),
  ],
  controllers: [UnitDefaultTestController],
  providers: [
    UnitDefaultTestMap,
    UnitDefaultTestRepository,
    UnitDefaultTestService,
  ],
  exports: [TypeOrmModule, UnitDefaultTestMap, UnitDefaultTestService],
})
export class UnitDefaultTestModule {}
