import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferenceMethodCodeRepository } from './reference-method-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ReferenceMethodCodeRepository])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ReferenceMethodCodeModule {}
