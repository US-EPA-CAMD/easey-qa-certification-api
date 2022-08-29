import { Test, TestingModule } from '@nestjs/testing';
import {
  TestQualificationBaseDTO,
  TestQualificationDTO,
} from '../dto/test-qualification.dto';
import { TestQualificationWorkspaceController } from './test-qualification-workspace.controller';
import { TestQualificationWorkspaceService } from './test-qualification-workspace.service';

const locId = '';
const testSumId = '';
const testUser = 'testUser';
const dto = new TestQualificationDTO();

const mockRataRunWorkspaceService = () => ({
  createTestQualification: jest.fn().mockResolvedValue(dto),
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
          useFactory: mockRataRunWorkspaceService,
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTestQualification', () => {
    it('Calls the service to create a new Test Qualification record', async () => {
      const result = await controller.createTestQualification(
        locId,
        testSumId,
        payload,
      );
      expect(result).toEqual(dto);
      expect(service.createTestQualification).toHaveBeenCalled();
    });
  });
});
