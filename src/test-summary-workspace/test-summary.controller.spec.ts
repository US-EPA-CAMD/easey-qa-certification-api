import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import {
  TestSummaryBaseDTO,
  TestSummaryDTO,
  TestSummaryRecordDTO,
} from '../dto/test-summary.dto';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { TestQualificationChecksService } from '../test-qualification-workspace/test-qualification-checks.service';

import { TestSummaryWorkspaceController } from './test-summary.controller';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const testSummaryDto = new TestSummaryDTO();
const testSummary = new TestSummaryRecordDTO();

const payload = new TestSummaryBaseDTO();

const mockTestSummaryWorkspaceService = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSummaryDto),
  getTestSummariesByLocationId: jest.fn().mockResolvedValue([testSummaryDto]),
  createTestSummary: jest.fn().mockResolvedValue(testSummary),
  updateTestSummary: jest.fn().mockResolvedValue(testSummary),
  deleteTestSummary: jest.fn().mockResolvedValue(''),
});

const mockTestSummaryChecksService = () => ({
  runChecks: jest.fn().mockResolvedValue([]),
});

const mockTestQualChecksService = () => ({
  runChecks: jest.fn().mockResolvedValue([]),
});

describe('Test Summary Controller', () => {
  let controller: TestSummaryWorkspaceController;
  let service: TestSummaryWorkspaceService;
  let checkService: TestSummaryChecksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [TestSummaryWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryWorkspaceService,
        },
        {
          provide: TestSummaryChecksService,
          useFactory: mockTestSummaryChecksService,
        },
        {
          provide: TestQualificationChecksService,
          useFactory: mockTestQualChecksService,
        },
        TestSummaryWorkspaceRepository,
        QASuppDataWorkspaceRepository,
        ReviewAndSubmitTestSummaryMap,
      ],
    }).compile();

    controller = module.get(TestSummaryWorkspaceController);
    service = module.get(TestSummaryWorkspaceService);
    checkService = module.get(TestSummaryChecksService);
  });

  describe('getTestSummary', () => {
    it('should call the TestSummaryWorkspaceService.getTestSummaryById', async () => {
      const spyService = jest.spyOn(service, 'getTestSummaryById');
      const result = await controller.getTestSummary('1', '1');
      expect(result).toEqual(testSummaryDto);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('getTestSummaries', () => {
    it('should call the TestSummaryWorkspaceService.getTestSummariesByLocationId', async () => {
      const spyService = jest.spyOn(service, 'getTestSummariesByLocationId');
      const result = await controller.getTestSummaries('1', {});
      expect(result).toEqual([testSummaryDto]);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('createTestSummary', () => {
    it('should create test summary record', async () => {
      const spyCheckService = jest.spyOn(checkService, 'runChecks');
      const spyService = jest.spyOn(service, 'createTestSummary');
      const result = await controller.createTestSummary('1', payload, user);
      expect(result).toEqual(testSummary);
      expect(spyCheckService).toHaveBeenCalled();
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('updateTestSummary', () => {
    it('should update test summary record', async () => {
      const spyCheckService = jest.spyOn(checkService, 'runChecks');
      const spyService = jest.spyOn(service, 'updateTestSummary');
      const result = await controller.updateTestSummary(
        '1',
        '1',
        payload,
        user,
      );
      expect(result).toEqual(testSummary);
      expect(spyCheckService).toHaveBeenCalled();
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('deleteTestSummary', () => {
    it('should delete test summary record', async () => {
      const spyService = jest.spyOn(service, 'deleteTestSummary');
      const result = await controller.deleteTestSummary('1', '1', user);
      expect(result).toEqual('');
      expect(spyService).toHaveBeenCalled();
    });
  });
});
