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
import { TestExtensionExemptionsWorkspaceService } from '../test-extension-exemptions-workspace/test-extension-exemptions-workspace.service';
import { TestExtensionExemptionDTO } from '../dto/test-extension-exemption.dto';

const testSummary = new TestSummaryDTO();
const testExtExem = new TestExtensionExemptionDTO();
const qaCertDto = new QACertificationDTO();
qaCertDto.testSummaryData = [testSummary];

const payload = new QACertificationImportDTO();
payload.testSummaryData = [new TestSummaryImportDTO()];
payload.testSummaryData[0].unitId = '1';
payload.testSummaryData[0].stackPipeId = '1';
payload.orisCode = 1;

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

const mockTestExtExemWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([testExtExem]),
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
          provide: TestExtensionExemptionsWorkspaceService,
          useFactory: mockTestExtExemWorkspaceService,
        },
      ],
    }).compile();

    service = module.get(QACertificationWorkspaceService);
  });

  describe('export', () => {
    it('successfully calls export() service function', async () => {
      const expected = qaCertDto;
      expected.testSummaryData = [testSummary];
      expected.testExtensionExemptionData = [testExtExem];
      expected.certificationEventData = [];
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
