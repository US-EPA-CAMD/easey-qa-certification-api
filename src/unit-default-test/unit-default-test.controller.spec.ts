import { Test, TestingModule } from '@nestjs/testing';
import { UnitDefaultTestController } from './unit-default-test.controller';
import { UnitDefaultTestService } from './unit-default-test.service';

describe('UnitDefaultTestController', () => {
  let controller: UnitDefaultTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitDefaultTestController],
      providers: [UnitDefaultTestService],
    }).compile();

    controller = module.get<UnitDefaultTestController>(
      UnitDefaultTestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
