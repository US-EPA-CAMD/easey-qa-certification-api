import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { TestSummaryBaseDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';

const locationId = '1';

const mockRepository = () => ({
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(null),
});
const mockQARepository = () => ({
  getQASuppDataByLocationId: jest.fn().mockResolvedValue(null),
});

describe('Test Summary Check Service Test', () => {
  let service: TestSummaryChecksService;
  let repository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryChecksService,
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: QASuppDataWorkspaceRepository,
          useFactory: mockQARepository,
        },
      ],
    }).compile();

    service = module.get(TestSummaryChecksService);
    repository = module.get(TestSummaryWorkspaceRepository);
  });

  describe('Linearity Injection Checks', () => {
    const payload = new TestSummaryBaseDTO();
    payload.testTypeCode = TestTypeCodes.LINE;
    it('Should pass all checks', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);
      const result = await service.runChecks(locationId, payload);

      expect(result).toEqual([]);
    });
  });

  // TEST-7 Test Dates Consistent
  describe('test7Check test', () => {
    const summaryBase: TestSummaryBaseDTO = {
      beginHour: 1,
      beginMinute: 1,
      endHour: 1,
      endMinute: 2,
      beginDate: new Date('2020-01-01'),
      endDate: new Date('2020-01-01'),
      testTypeCode: TestTypeCodes.ONOFF.toString(),
      testNumber: '',
    };

    it('returns error message when beginDate/hour >= endDate/hour for testTypeCode=ONOFF', () => {
      const result = service.test7Check(summaryBase);
      expect(result).not.toBeNull();
    });

    it('returns null when beginDate/hour < endDate/hour for testTypeCode=ONOFF', () => {
      const summary = { ...summaryBase };
      summary.endHour = 2;
      const result = service.test7Check(summary);

      expect(result).toBeNull();
    });

    it('returns error message when testTypeCode=LINE and beginMinute > endMinute', () => {
      const summary = { ...summaryBase };
      summary.testTypeCode = TestTypeCodes.LINE.toString();
      summary.beginMinute = 3;

      const result = service.test7Check(summary);

      expect(result).not.toBeNull();
    });

    it('returns null when testTypeCode=LINE and beginMinute <= endMinute', () => {
      const summary = { ...summaryBase };
      summary.testTypeCode = TestTypeCodes.LINE.toString();

      const result = service.test7Check(summary);

      expect(result).toBeNull();
    });
  });
});
