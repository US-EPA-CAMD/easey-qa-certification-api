import { Test, TestingModule } from '@nestjs/testing';
import { RataTraverseService } from './rata-traverse.service';

describe('RataTraverseService', () => {
  let service: RataTraverseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RataTraverseService],
    }).compile();

    service = module.get<RataTraverseService>(RataTraverseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
