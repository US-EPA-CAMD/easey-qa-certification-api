import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { TestSummaryBaseDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';

describe('Test Summary Check Service Test', () => {
  let service: TestSummaryChecksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryChecksService,
        TestSummaryWorkspaceRepository,
        QASuppDataWorkspaceRepository,
      ],
    }).compile();

    service = module.get(TestSummaryChecksService);
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
