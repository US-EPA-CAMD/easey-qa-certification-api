import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeSummaryController } from './cycle-time-summary.controller';
import { CycleTimeSummaryService } from './cycle-time-summary.service';
import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';

const locId = '';
const testSumId = '';
const id = '';

const dto = new CycleTimeSummaryDTO();

const mockService = () => ({
  getCycleTimeSummary: jest.fn().mockResolvedValue(dto),
  getCycleTimeSummaries: jest.fn().mockResolvedValue([dto]),
});

describe('CycleTimeSummaryController', () => {
  let controller: CycleTimeSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CycleTimeSummaryController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: CycleTimeSummaryService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<CycleTimeSummaryController>(
      CycleTimeSummaryController,
    );
  });

  describe('getCycleTimeSummary', () => {
    it('Calls the service to get a Cycle Time Summary record', async () => {
      const result = await controller.getCycleTimeSummary(locId, testSumId, id);
      expect(result).toEqual(dto);
    });
  });

  describe('getCycleTimeSummaries', () => {
    it('Calls the service to many Cycle Time Summary records', async () => {
      const result = await controller.getCycleTimeSummaries(locId, testSumId);
      expect(result).toEqual([dto]);
    });
  });
});
