import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GasTypeCodeRepository } from './gas-type-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GasTypeCodeRepository])],
  exports: [TypeOrmModule],
})
export class GasTypeCodeModule {}
