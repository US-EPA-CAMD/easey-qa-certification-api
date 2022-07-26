import { Test, TestingModule } from '@nestjs/testing';
import { TestSummaryMasterDataRelationshipService } from './test-summary-master-data-relationship.service';

describe('TestSummaryMasterDataRelationshipService', () => {
  let service: TestSummaryMasterDataRelationshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestSummaryMasterDataRelationshipService],
    }).compile();

    service = module.get<TestSummaryMasterDataRelationshipService>(TestSummaryMasterDataRelationshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
