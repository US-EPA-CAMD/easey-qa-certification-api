import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestService } from './unit-default-test.service';

describe('UnitDefaultTestService', () => {
  let service: UnitDefaultTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitDefaultTestService],
    }).compile();

    service = module.get<UnitDefaultTestService>(UnitDefaultTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
