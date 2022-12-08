import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { CycleTimeInjectionController } from './cycle-time-injection.controller';
import { CycleTimeInjectionRepository } from './cycle-time-injection.repository';
import { CycleTimeInjectionService } from './cycle-time-injection.service';

describe('CycleTimeInjectionController', () => {
  let controller: CycleTimeInjectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CycleTimeInjectionController],
      providers: [
        CycleTimeInjectionService,
        {
          provide: CycleTimeInjectionRepository,
          useFactory: () => ({}),
        },
        {
          provide: CycleTimeInjectionMap,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get<CycleTimeInjectionController>(
      CycleTimeInjectionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
