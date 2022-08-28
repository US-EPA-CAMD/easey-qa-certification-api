import { Test, TestingModule } from '@nestjs/testing';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  TestQualificationBaseDTO,
  TestQualificationDTO,
} from '../dto/test-qualification.dto';
import { TestQualification } from '../entities/workspace/test-qualification.entity';
import { TestQualificationMap } from '../maps/test-qualification.map';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

const testSumId = '';
const userId = 'user';
const entity = new TestQualification();
const dto = new TestQualificationDTO();

const payload: TestQualificationBaseDTO = {
  testClaimCode: 'SLC',
  beginDate: new Date(),
  endDate: new Date(),
  highLoadPercentage: 0,
  midLoadPercentage: 0,
  lowLoadPercentage: 0,
};

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('TestQualificationWorkspaceService', () => {
  let service: TestQualificationWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestQualificationWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: TestQualificationWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: TestQualificationMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<TestQualificationWorkspaceService>(
      TestQualificationWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
  });

  describe('createTestQualification', () => {
    it('Should create and return a new Test Qualification record', async () => {
      const result = await service.createTestQualification(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });
});
