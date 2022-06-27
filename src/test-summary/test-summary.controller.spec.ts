import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestSummaryDTO } from '../dto/test-summary.dto';

import { TestSummaryController } from './test-summary.controller';
import { TestSummaryService } from './test-summary.service';

const testSummaryDto = new TestSummaryDTO();

const mockTestSummaryService = () => ({
  getTestSummariesByLocationId: jest.fn().mockResolvedValue([testSummaryDto]),
  getTestSummaryById: jest.fn().mockResolvedValue(testSummaryDto),
});

describe('Test Summary Controller', () => {
  let controller: TestSummaryController;
  let service: TestSummaryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [TestSummaryController],
      providers: [
        {
          provide: TestSummaryService,
          useFactory: mockTestSummaryService,
        },
      ],
    }).compile();

    controller = module.get(TestSummaryController);
    service = module.get(TestSummaryService);
  });

  describe('getTestSummaries', () => {
    it('should call the TestSummaryService.getTestSummariesByLocationId', async () => {
      const spyService = jest.spyOn(service, 'getTestSummariesByLocationId');
      const result = await controller.getTestSummaries('1', {});
      expect(result).toEqual([testSummaryDto]);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('getTestSummary', () => {
    it('should call the TestSummaryService.getTestSummaryById', async () => {
      const spyService = jest.spyOn(service, 'getTestSummaryById');
      const result = await controller.getTestSummary('1', '1');
      expect(result).toEqual(testSummaryDto);
      expect(spyService).toHaveBeenCalled();
    });
  });
});
