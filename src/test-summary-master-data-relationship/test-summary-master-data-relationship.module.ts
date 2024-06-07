import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryMasterDataRelationshipRepository } from './test-summary-master-data-relationship.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestSummaryMasterDataRelationshipRepository]),
  ],
  controllers: [],
  providers: [TestSummaryMasterDataRelationshipRepository],
  exports: [TypeOrmModule, TestSummaryMasterDataRelationshipRepository],
})
export class TestSummaryMasterDataRelationshipModule {}
