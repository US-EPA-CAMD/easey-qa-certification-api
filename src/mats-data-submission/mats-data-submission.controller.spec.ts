import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';
import { DataSource } from 'typeorm';

import { MatsDataSubmissionChecksService } from './mats-data-submission-checks.service';
import { MatsDataSubmissionController } from './mats-data-submission.controller';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

describe('MatsDataSubmissionController', () => {
  let controller: MatsDataSubmissionController;
  let checksService: MatsDataSubmissionChecksService;
  let service: MatsDataSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatsDataSubmissionController],
      imports: [HttpModule, LoggerModule],
      providers: [
        ConfigService,
        {
          provide: DataSource,
          useValue: {},
        },
        EntityManager,
        MatsDataSubmissionChecksService,
        MatsDataSubmissionMap,
        MatsDataSubmissionRepository,
        MatsDataSubmissionService,
      ],
    }).compile();

    controller = module.get<MatsDataSubmissionController>(
      MatsDataSubmissionController,
    );
    checksService = module.get<MatsDataSubmissionChecksService>(
      MatsDataSubmissionChecksService,
    );
    service = module.get<MatsDataSubmissionService>(MatsDataSubmissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteMatsDataSubmission', () => {
    it('should call the service to delete a submission', async () => {
      service.deleteMatsDataSubmission = jest.fn().mockResolvedValue(undefined);
      await controller.deleteMatsDataSubmission('1');
      expect(service.deleteMatsDataSubmission).toHaveBeenCalledWith('1');
    });
  });

  describe('initializeMatsDataSubmission', () => {
    it('should call the service to create a new submission', async () => {
      checksService.runChecks = jest.fn().mockResolvedValue([]);
      service.initializeMatsDataSubmission = jest.fn().mockResolvedValue('1');
      const res = await controller.initializeMatsDataSubmission('{}', {}, user);
      expect(res).toEqual({ warnings: [], id: '1' });
    });
  });
});
