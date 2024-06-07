import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RataFrequencyCodeRepository } from './rata-frequency-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RataFrequencyCodeRepository])],
  controllers: [],
  providers: [RataFrequencyCodeRepository],
  exports: [TypeOrmModule, RataFrequencyCodeRepository],
})
export class RataFrequencyCodeModule {}
