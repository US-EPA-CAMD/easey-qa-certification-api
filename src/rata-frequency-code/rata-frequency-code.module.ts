import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RataFrequencyCodeRepository } from './rata-frequency-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RataFrequencyCodeRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class RataFrequencyCodeModule {}
