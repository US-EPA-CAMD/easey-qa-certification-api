import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitRepository } from './unit.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UnitRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UnitModule {}
