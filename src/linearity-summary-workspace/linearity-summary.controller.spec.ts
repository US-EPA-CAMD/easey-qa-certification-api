import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';

import {
  LinearitySummaryBaseDTO,
  LinearitySummaryDTO,
} from '../dto/linearity-summary.dto';
import { LinearitySummaryWorkspaceController } from './linearity-summary.controller';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';

const locId = '1';
const testSumId = '2';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const payload = new LinearitySummaryBaseDTO();
const linearitySummaryId = 'linearitySummaryId';
const linearitySummaryRecord = new LinearitySummaryDTO();
const linearitySummaryRecords = [linearitySummaryRecord];

const mockService = () => ({
  getSummariesByTestSumId: jest.fn().mockResolvedValue(linearitySummaryRecords),
  getSummaryById: jest.fn().mockResolvedValue(linearitySummaryRecord),
  createSummary: jest.fn().mockResolvedValue(linearitySummaryRecord),
  deleteSummary: jest.fn().mockResolvedValue(undefined),
  updateSummary: jest.fn().mockResolvedValue(linearitySummaryRecord),
});

describe('Linearity Summary Controller', () => {
  let controller: LinearitySummaryWorkspaceController;
  let service: LinearitySummaryWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [LinearitySummaryWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: LinearitySummaryWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: LinearitySummaryChecksService,
          useFactory: () => ({
            runChecks: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get(LinearitySummaryWorkspaceController);
  });

  describe('getSummariesByTestSumId', () => {
    it('Calls the repository to get all Linearity Summary records by Test Summary Id', async () => {
      const result = await controller.getSummariesByTestSumId(locId, testSumId);
      expect(result).toEqual(linearitySummaryRecords);
    });
  });

  describe('getSummaryById', () => {
    it('Calls the repository to get one Linearity Summary record by Id', async () => {
      const result = await controller.getSummaryById(
        locId,
        testSumId,
        linearitySummaryId,
      );
      expect(result).toEqual(linearitySummaryRecord);
    });
  });

  describe('updateSummary', () => {
    it('Calls the service and update a existing Linearity Summary record', async () => {
      const result = await controller.updateSummary(
        locId,
        testSumId,
        linearitySummaryId,
        payload,
        user,
      );
      expect(result).toEqual(linearitySummaryRecord);
    });
  });

  describe('createSummary', () => {
    it('Calls the service to create a new Linearity Summary record', async () => {
      const result = await controller.createSummary(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(linearitySummaryRecord);
    });
  });

  describe('deleteSummary', () => {
    it('Calls the service and delete a Linearity Summary record', async () => {
      const result = await controller.deleteSummary(
        locId,
        testSumId,
        linearitySummaryId,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
