import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeInjectionController } from './cycle-time-injection.controller';
import { CycleTimeInjectionService } from './cycle-time-injection.service';

describe('CycleTimeInjectionController', () => {
  let controller: CycleTimeInjectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CycleTimeInjectionController],
      providers: [CycleTimeInjectionService],
    }).compile();

    controller = module.get<CycleTimeInjectionController>(
      CycleTimeInjectionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
