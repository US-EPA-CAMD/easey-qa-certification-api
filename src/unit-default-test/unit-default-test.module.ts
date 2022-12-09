import { Module } from '@nestjs/common';
import { UnitDefaultTestService } from './unit-default-test.service';
import { UnitDefaultTestController } from './unit-default-test.controller';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitDefaultTestRepository } from './unit-default-test.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UnitDefaultTestRepository])],
  controllers: [UnitDefaultTestController],
  providers: [UnitDefaultTestMap, UnitDefaultTestService],
  exports: [TypeOrmModule, UnitDefaultTestMap, UnitDefaultTestService],
})
export class UnitDefaultTestModule {}
