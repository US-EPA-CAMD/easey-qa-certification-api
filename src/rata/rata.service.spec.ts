import { Test, TestingModule } from '@nestjs/testing';
import { RataService } from './rata.service';

describe('RataService', () => {
  let service: RataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RataService],
    }).compile();

    service = module.get<RataService>(RataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
