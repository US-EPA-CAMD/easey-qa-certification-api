import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GasComponentCodeRepository } from './gas-component-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GasComponentCodeRepository])],
  exports: [TypeOrmModule],
})
export class GasComponentCodeModule {}
