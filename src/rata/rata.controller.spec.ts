import { Test, TestingModule } from '@nestjs/testing';
import { RataController } from './rata.controller';
import { RataService } from './rata.service';

describe('RataController', () => {
  let controller: RataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RataController],
      providers: [RataService],
    }).compile();

    controller = module.get<RataController>(RataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
