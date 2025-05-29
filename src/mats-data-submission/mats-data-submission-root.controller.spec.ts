import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { DataSource } from 'typeorm';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { MatsDataSubmissionDTO } from '../dto/mats-data-submission.dto';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';
import { MatsDataSubmissionRootController } from './mats-data-submission-root.controller';

describe('QA Certification Workspace Controller Test', () => {
  let controller: MatsDataSubmissionRootController;
  let service: MatsDataSubmissionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, HttpModule],
      controllers: [MatsDataSubmissionRootController],
      providers: [
        ConfigService,
        AuthGuard,
        EntityManager,
        {
          provide: DataSource,
          useValue: {},
        },
        MatsDataSubmissionMap,
        MatsDataSubmissionRepository,
        MatsDataSubmissionRootController,
        MatsDataSubmissionService,
      ],
    }).compile();

    controller = module.get(MatsDataSubmissionRootController);
    service = module.get(MatsDataSubmissionService);
  });

  describe('getMatsDataSubmissions', () => {
    it('should call the review and submit mats data submission controller function and return a list of dtos', async () => {
      const dto = new MatsDataSubmissionDTO();
      service.getMatsDataSubmissions = jest.fn().mockResolvedValue([dto]);

      const result = await controller.getMatsDataSubmissions(['1']);
      expect(result).toEqual({ items: [dto] });
    });
  });
});
