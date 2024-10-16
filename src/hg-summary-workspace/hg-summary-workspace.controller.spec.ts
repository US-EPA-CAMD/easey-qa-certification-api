import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';

import { HgSummaryBaseDTO, HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummaryWorkspaceController } from './hg-summary-workspace.controller';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';

const locId = '';
const testSumId = '';
const id = '';
const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};
const dto = new HgSummaryDTO();

const payload = new HgSummaryBaseDTO();

const mockService = () => ({
  createHgSummary: jest.fn().mockResolvedValue(dto),
  updateHgSummary: jest.fn().mockResolvedValue(dto),
  getHgSummary: jest.fn().mockResolvedValue(dto),
  getHgSummaries: jest.fn().mockResolvedValue([dto]),
  deleteHgSummary: jest.fn().mockResolvedValue(undefined),
});

describe('HgSummaryWorkspaceController', () => {
  let controller: HgSummaryWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [HgSummaryWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: HgSummaryWorkspaceService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<HgSummaryWorkspaceController>(
      HgSummaryWorkspaceController,
    );
  });

  describe('getHgSummary', () => {
    it('Calls the service to get a Cycle Time Summary record', async () => {
      const result = await controller.getHgSummary(locId, testSumId, id);
      expect(result).toEqual(dto);
    });
  });

  describe('getHgSummaries', () => {
    it('Calls the service to many Cycle Time Summary records', async () => {
      const result = await controller.getHgSummaries(locId, testSumId);
      expect(result).toEqual([dto]);
    });
  });

  describe('createHgSummary', () => {
    it('Calls the service and create a new Hg Summary record', async () => {
      const result = await controller.createHgSummary(
        locId,
        testSumId,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('updateHgSummary', () => {
    it('Calls the service and update a existing Hg Summary record', async () => {
      const result = await controller.updateHgSummary(
        locId,
        testSumId,
        id,
        payload,
        user,
      );
      expect(result).toEqual(dto);
    });
  });

  describe('deleteHgSummary', () => {
    it('Calls the service and delete a Hg Summary record', async () => {
      const result = await controller.deleteHgSummary(
        locId,
        testSumId,
        id,
        user,
      );
      expect(result).toEqual(undefined);
    });
  });
});
