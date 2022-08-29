import { Test, TestingModule } from '@nestjs/testing';
import { TestQualificationService } from './test-qualification.service';

describe('TestQualificationService', () => {
  let service: TestQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestQualificationService],
    }).compile();

    service = module.get<TestQualificationService>(TestQualificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
