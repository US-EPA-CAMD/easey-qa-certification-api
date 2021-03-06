import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryMasterDataRelationshipRepository } from './test-summary-master-data-relationship.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestSummaryMasterDataRelationshipRepository]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class TestSummaryMasterDataRelationshipModule {}
