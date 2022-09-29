import { Test, TestingModule } from '@nestjs/testing';
import {
  TestQualificationBaseDTO,
  TestQualificationDTO,
  TestQualificationRecordDTO,
} from '../dto/test-qualification.dto';
import { TestQualificationWorkspaceController } from './test-qualification-workspace.controller';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

const locId = '';
const testSumId = '';
const testQualificationId = 'g7h8i9';
const testUser = 'testUser';

const testQualificationRecord = new TestQualificationRecordDTO();
const testQualifications = [testQualificationRecord];

const mockTestQualificationWorkspaceService = () => ({
  getTestQualifications: jest.fn().mockResolvedValue(testQualifications),
  getTestQualification: jest.fn().mockResolvedValue(testQualificationRecord),
  createTestQualification: jest.fn().mockResolvedValue(testQualificationRecord),
  deleteTestQualification: jest.fn().mockResolvedValue(null),
});

const payload: TestQualificationBaseDTO = {
  testClaimCode: 'SLC',
  beginDate: new Date(),
  endDate: new Date(),
  highLoadPercentage: 0,
  midLoadPercentage: 0,
  lowLoadPercentage: 0,
};

describe('TestQualificationWorkspaceController', () => {
  let controller: TestQualificationWorkspaceController;
  let service: TestQualificationWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestQualificationWorkspaceController],
      providers: [
        {
          provide: TestQualificationWorkspaceService,
          useFactory: mockTestQualificationWorkspaceService,
        },
      ],
    }).compile();

    controller = module.get<TestQualificationWorkspaceController>(
      TestQualificationWorkspaceController,
    );
    service = module.get<TestQualificationWorkspaceService>(
      TestQualificationWorkspaceService,
    );
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

  describe('createTestQualification', () => {
    it('Calls the service to create a new Test Qualification record', async () => {
      const result = await controller.createTestQualification(
        locId,
        testSumId,
        payload,
      );
      expect(result).toEqual(testQualificationRecord);
      expect(service.createTestQualification).toHaveBeenCalled();
    });
  });

  describe('deleteTestQualification', () => {
    it('should call the TestQualification.deleteTestQualification and delete test qualification record', async () => {
      const result = await controller.deleteTestQualification(
        locId,
        testQualificationId,
        testSumId,
      );
      expect(result).toEqual(null);
      expect(service.deleteTestQualification).toHaveBeenCalled();
    });
  });
});
