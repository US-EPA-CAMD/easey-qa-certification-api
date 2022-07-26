import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSummaryMasterDataRelationshipRepository } from './test-summary-master-data-relationship.repository';
import { TestSummaryMasterDataRelationshipService } from './test-summary-master-data-relationship.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestSummaryMasterDataRelationshipRepository]),
  ],
  controllers: [],
  providers: [TestSummaryMasterDataRelationshipService],
  exports: [TypeOrmModule, TestSummaryMasterDataRelationshipService],
})
export class TestSummaryMasterDataRelationshipModule {}
