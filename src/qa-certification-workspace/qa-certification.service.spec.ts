import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { TestSummaryDTO, TestSummaryImportDTO } from '../dto/test-summary.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { QaCertificationEventWorkshopService } from '../qa-certification-event-workshop/qa-certification-event-workshop.service';
import {
  QACertificationEventDTO,
  QACertificationEventImportDTO,
} from '../dto/qa-certification-event.dto';

const testSummary = new TestSummaryDTO();
const qaCertEventDto = new QACertificationEventDTO();
const qaCertDto = new QACertificationDTO();
qaCertDto.testSummaryData = [testSummary];
qaCertDto.certificationEventData = [qaCertEventDto];

const payload = new QACertificationImportDTO();
payload.testSummaryData = [new TestSummaryImportDTO()];
payload.testSummaryData[0].unitId = '1';
payload.testSummaryData[0].stackPipeId = '1';
payload.orisCode = 1;
payload.certificationEventData = [new QACertificationEventImportDTO()];
payload.certificationEventData[0].unitId = '1';
payload.certificationEventData[0].stackPipeId = '1';

const userId = 'testUser';

const qaSuppData = new QASuppData();
qaSuppData.testSumId = '1';

const location: LocationIdentifiers = {
  unitId: '1',
  locationId: '1',
  stackPipeId: '1',
  systemIDs: ['1'],
  componentIDs: ['1'],
};
const mockTestSummaryWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([testSummary]),
  import: jest.fn().mockResolvedValue(undefined),
});

const mockQACertEventService = () => ({
  export: jest.fn().mockResolvedValue([qaCertEventDto]),
  import: jest.fn().mockResolvedValue(undefined),
});

describe('QA Certification Workspace Service Test', () => {
  let service: QACertificationWorkspaceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QACertificationWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryWorkspaceService,
        },
        {
          provide: QaCertificationEventWorkshopService,
          useFactory: mockQACertEventService,
        },
      ],
    }).compile();

    service = module.get(QACertificationWorkspaceService);
  });

  describe('export', () => {
    it('successfully calls export() service function', async () => {
      const expected = qaCertDto;
      expected.testSummaryData = [testSummary];
      expected.certificationEventData = [qaCertEventDto];
      expected.testExtensionExemptionData = undefined;
      expected.orisCode = 1;

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      const result = await service.export(paramsDTO);

      expect(result).toEqual(expected);
    });
  });

  describe('import', () => {
    it('successfully calls import() service function', async () => {
      const result = await service.import([location], payload, userId, []);
      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
      });
    });

    it('successfully calls import() service function when qaSuppData found ', async () => {
      const result = await service.import([location], payload, userId, [
        qaSuppData,
      ]);
      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
      });
    });
  });
});
