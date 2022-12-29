import { Module } from '@nestjs/common';
import { UnitDefaultTestRunService } from './unit-default-test-run.service';
import { UnitDefaultTestRunController } from './unit-default-test-run.controller';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitDefaultTestRunRepository } from './unit-default-test-run.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UnitDefaultTestRunRepository])],
  controllers: [UnitDefaultTestRunController],
  providers: [UnitDefaultTestRunMap, UnitDefaultTestRunService],
  exports: [TypeOrmModule, UnitDefaultTestRunMap, UnitDefaultTestRunService],
})
export class UnitDefaultTestRunModule {}
