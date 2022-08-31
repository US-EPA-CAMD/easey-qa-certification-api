import { Test, TestingModule } from '@nestjs/testing';
import { TestQualificationController } from './test-qualification.controller';
import { TestQualificationService } from './test-qualification.service';
import { TestQualificationRecordDTO } from '../dto/test-qualification.dto';

const locId = 'a1b2c3';
const testSumId = 'd4e5f6';
const testQualificationId = 'g7h8i9';

const testQualificationRecord = new TestQualificationRecordDTO();
const testQualifications = [testQualificationRecord];

const mockTestQualificationService = () => ({
  getTestQualifications: jest.fn().mockResolvedValue(testQualifications),
  getTestQualification: jest.fn().mockResolvedValue(testQualificationRecord),
});

describe('TestQualificationController', () => {
  let controller: TestQualificationController;
  let service: TestQualificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestQualificationController],
      providers: [
        {
          provide: TestQualificationService,
          useFactory: mockTestQualificationService,
        },
      ],
    }).compile();

    controller = module.get<TestQualificationController>(
      TestQualificationController,
    );
    service = module.get<TestQualificationService>(TestQualificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTestQualifications', () => {
    it('Calls service to get all Test Qualification records for a given Test Summary ID', async () => {
      const results = await controller.getTestQualifications(locId, testSumId);
      expect(results).toEqual(testQualifications);
      expect(service.getTestQualifications).toHaveBeenCalled();
    });
  });

  describe('getTestQualification', () => {
    it('Calls service to get one Test Qualification record by its ID', async () => {
      const results = await controller.getTestQualification(
        locId,
        testSumId,
        testQualificationId,
      );
      expect(results).toEqual(testQualificationRecord);
      expect(service.getTestQualification).toHaveBeenCalled();
    });
  });
});
