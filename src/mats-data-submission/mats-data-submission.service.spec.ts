import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';

import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';
import { MatsDataSubmission } from '../entities/mats-data-submission.entity';
import { MatsPollutantCode } from '../entities/mats-pollutant-code.entity';
import { MatsTestMethodCode } from '../entities/mats-test-method-code.entity';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { Plant } from '../entities/plant.entity';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';
import { MatsDataSubmissionService } from './mats-data-submission.service';

function createMockSubmission() {
  const entity = new MatsDataSubmission();
  const pollutant = new MatsPollutantCode();
  pollutant.metadataPollutantCode = 'ANY';
  const testMethod = new MatsTestMethodCode();
  testMethod.code = 'MTH';

  entity.addTime = new Date();
  entity.averagingGroupCode = 'AGC';
  entity.facility = new Plant();
  entity.facilityId = 10;
  entity.id = '2';
  entity.location = new MonitorLocation();
  entity.locationId = '12345';
  entity.monitorPlanId = '12345';
  entity.statusCode = 'NEW';
  entity.originalSubmissionId = '1';
  entity.pollutants = [pollutant];
  entity.quarter = 1;
  entity.reportTypeCode = 'RPT';
  entity.testComment = 'Test Comment';
  entity.testDate = new Date();
  entity.testMethods = [testMethod];
  entity.testNumber = '123456';
  entity.updateTime = new Date();
  entity.userId = 'TESTID';
  entity.year = 2023;
  return entity;
}

const mockEntity = createMockSubmission();
const mockEntityManager = {
  transaction: jest.fn(
    async (passedFunction) => await passedFunction(mockEntityManager),
  ),
};
const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(mockEntity),
});

describe('MatsDataSubmissionService', () => {
  let service: MatsDataSubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ConfigService,
        {
          provide: EntityManager,
          useFactory: () => mockEntityManager,
        },
        MatsDataSubmissionMap,
        {
          provide: MatsDataSubmissionRepository,
          useFactory: mockRepository,
        },
        MatsDataSubmissionService,
      ],
    }).compile();

    service = module.get<MatsDataSubmissionService>(MatsDataSubmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateMetadataXml', () => {
    it('should return an object with an XMl buffer', async () => {
      const res = await service.generateMetadataXml(mockEntity.id);
      expect(res.mimetype).toEqual('text/xml');
      expect(res.originalname).toEqual('Metadata.xml');
      expect(res.buffer).toBeDefined();
    });
  });

  describe('generateXmlString', () => {
    it('should return an XML string', () => {
      const data = {
        RootElement: {
          Object: {
            PropertyOne: 'ValueOne',
            PropertyTwo: null,
            PropertyThree: 3,
          },
          List: {
            Code: ['Code1', 'Code2'],
          },
        },
      };
      const res = (service as any).generateXmlString(data);
      expect(res).toContain('<RootElement>');
    });
  });

  describe('initializeMatsDataSubmission', () => {
    it('should call the repository to create a new submission', async () => {
      const submissionId = 1;
      jest
        .spyOn(service as any, 'createMatsDataSubmission')
        .mockResolvedValue(submissionId);
      jest
        .spyOn(service as any, 'createMatsDataSubmissionPollutants')
        .mockResolvedValue([1]);
      jest
        .spyOn(service as any, 'createMatsDataSubmissionTestMethods')
        .mockResolvedValue([1]);
      jest
        .spyOn(service as any, 'uploadFilesAndCreateRecords')
        .mockImplementation(jest.fn());

      const payload = new MatsDataSubmissionBaseDTO();
      const files = { ertFile: null, payloadFile: null, supportingFiles: [] };
      const res = await service.initializeMatsDataSubmission(
        payload,
        files,
        'TESTID',
      );

      expect((service as any).createMatsDataSubmission).toHaveBeenCalled();
      expect(
        (service as any).createMatsDataSubmissionPollutants,
      ).toHaveBeenCalled();
      expect(
        (service as any).createMatsDataSubmissionTestMethods,
      ).toHaveBeenCalled();
      expect((service as any).uploadFilesAndCreateRecords).toHaveBeenCalled();
      expect(res).toEqual(submissionId);
    });
  });
});
