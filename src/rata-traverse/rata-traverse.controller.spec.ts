import { Test, TestingModule } from '@nestjs/testing';
import { RataTraverseController } from './rata-traverse.controller';
import { RataTraverseService } from './rata-traverse.service';

describe('RataTraverseController', () => {
  let controller: RataTraverseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataTraverseController],
      providers: [
        {
          provide: RataTraverseService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<RataTraverseController>(RataTraverseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
