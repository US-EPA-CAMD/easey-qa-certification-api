import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossCheckCatalogValueRepository } from './cross-check-catalog-value.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CrossCheckCatalogValueRepository])],
  providers: [CrossCheckCatalogValueRepository],
  exports: [TypeOrmModule, CrossCheckCatalogValueRepository],
})
export class CrossCheckCatalogValueModule {}
