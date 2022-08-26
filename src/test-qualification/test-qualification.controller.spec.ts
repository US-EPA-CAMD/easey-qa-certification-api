import { Test, TestingModule } from '@nestjs/testing';
import { TestQualificationController } from './test-qualification.controller';
import { TestQualificationService } from './test-qualification.service';

describe('TestQualificationController', () => {
  let controller: TestQualificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestQualificationController],
      providers: [TestQualificationService],
    }).compile();

    controller = module.get<TestQualificationController>(
      TestQualificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
